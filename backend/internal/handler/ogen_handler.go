// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package handler

//go:generate go run github.com/ogen-go/ogen/cmd/ogen@latest --target ./generated/ --clean ../../../config/comunicore-api.yaml

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/rs/cors"

	"github.com/comunicore/comunicore/backend/internal/apperror"
	api "github.com/comunicore/comunicore/backend/internal/handler/generated"
	"github.com/comunicore/comunicore/backend/internal/lib/config"
	urlencode "github.com/comunicore/comunicore/backend/internal/lib/urlEncode"
	"github.com/ogen-go/ogen/ogenerrors"

	analyticsRepo "github.com/comunicore/comunicore/backend/internal/repository/analytics"
	authRepo "github.com/comunicore/comunicore/backend/internal/repository/auth"
	commentsRepo "github.com/comunicore/comunicore/backend/internal/repository/comments"
	mediaRepo "github.com/comunicore/comunicore/backend/internal/repository/media"
	postsRepo "github.com/comunicore/comunicore/backend/internal/repository/posts"
	userRepo "github.com/comunicore/comunicore/backend/internal/repository/user"

	analyticsService "github.com/comunicore/comunicore/backend/internal/service/analytics"
	authService "github.com/comunicore/comunicore/backend/internal/service/auth"
	mediaService "github.com/comunicore/comunicore/backend/internal/service/media"
	postsService "github.com/comunicore/comunicore/backend/internal/service/posts"
	userService "github.com/comunicore/comunicore/backend/internal/service/user"
)

// OgenHandler implements api.Handler.
type OgenHandler struct {
	authHandler      *AuthHandler
	userHandler      *UserHandler
	postsHandler     *PostsHandler
	mediaHandler     *MediaHandler
	analyticsHandler *AnalyticsHandler
	api.UnimplementedHandler
}

func NewOgenHandler(
	authHandler *AuthHandler,
	userHandler *UserHandler,
	postsHandler *PostsHandler,
	mediaHandler *MediaHandler,
	analyticsHandler *AnalyticsHandler,
) *OgenHandler {

	return &OgenHandler{
		postsHandler:     postsHandler,
		userHandler:      userHandler,
		authHandler:      authHandler,
		mediaHandler:     mediaHandler,
		analyticsHandler: analyticsHandler,
	}
}

// optionalCookieSession attaches user id to GlobalContext when a valid sid cookie is present
// (for routes that do not run ogen cookie security, e.g. analytics batch ingest).
func optionalCookieSession(authR *authRepo.AuthRepo, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gc := GlobalContextFromContext(r.Context())
		if gc == nil {
			next.ServeHTTP(w, r)
			return
		}
		cookie, err := r.Cookie("sid")
		if err != nil {
			next.ServeHTTP(w, r)
			return
		}
		sessionID, err := urlencode.Decode(cookie.Value)
		if err != nil || len(sessionID) == 0 {
			next.ServeHTTP(w, r)
			return
		}
		sessionUUID, err := uuid.FromBytes(sessionID)
		if err != nil {
			next.ServeHTTP(w, r)
			return
		}
		userID, err := authR.GetUserIDBySessionID(r.Context(), sessionUUID)
		if err != nil {
			next.ServeHTTP(w, r)
			return
		}
		gc.SessionID = sessionUUID
		gc.UserID = userID
		gc.UserIDIsSet = true
		next.ServeHTTP(w, r)
	})
}

type securityHandler struct {
	authRepo *authRepo.AuthRepo
}

func NewSecurityHandler(authRepo *authRepo.AuthRepo) *securityHandler {
	return &securityHandler{
		authRepo: authRepo,
	}
}

func (h *securityHandler) HandleCookieAuth(
	ctx context.Context, operationName api.OperationName, t api.CookieAuth) (context.Context, error) {

	op := "securityHandler.HandleCookieAuth"
	fmt.Printf("Cookie Auth with operation name %s\n", operationName)
	global := GlobalContextFromContext(ctx)
	if global == nil {
		return ctx, apperror.NewAuthenticationError(op, nil, "context not found")
	}
	sessionID, err := urlencode.Decode(t.APIKey)
	if err != nil {
		log.Printf("Failed decode session id from cookie: %v\n", err)
		return ctx, apperror.NewAuthenticationError(op, err, "invalid Cookie session id")
	}
	if len(sessionID) == 0 {
		log.Printf("Empty session id in cookie\n")
		return ctx, apperror.NewAuthenticationError(op, nil, "empty Cookie session id")
	}
	sessionUUID, err := uuid.FromBytes(sessionID)
	if err != nil {
		log.Printf("Failed to parse session id from cookie: %v\n", err)
		return ctx, apperror.NewAuthenticationError(op, err, "invalid Cookie session id format")
	}
	fmt.Printf("op %s, Cookie auth valid\n", op)
	global.SessionID = sessionUUID
	userID, err := h.authRepo.GetUserIDBySessionID(ctx, sessionUUID)
	if err != nil {
		log.Printf("Failed to get user ID by session ID: %v\n", err)
		return ctx, apperror.NewAuthenticationError(op, err, "failed to get user ID")
	}
	global.UserID = userID
	global.UserIDIsSet = true

	return ctx, nil
}

type errorHandler struct{}

func sendErrorStringMessage(w http.ResponseWriter, httpCode int, err error, errMessage string) {
	e := api.ErrorStringMessage{
		Code:    api.ErrorStringMessageCodeErrorStringMessage,
		Message: errMessage,
	}
	w.Header().Set("Content-Type", "application/json")
	data, err := e.MarshalJSON()
	if err != nil {
	}
	w.WriteHeader(httpCode)
	_, _ = w.Write(data)
}
func (h *errorHandler) handler(ctx context.Context, w http.ResponseWriter, r *http.Request, err error) {
	fmt.Printf("in ogen error handler\n")
	var (
		code = http.StatusInternalServerError
	)
	// !!! errors handling order here is VERY important, because some errors can be wrapped in other errors,
	// so we need to check for more specific errors first
	if authenticationError, ok := errors.AsType[*apperror.AuthenticationError](err); ok {
		log.Printf("AuthenticationError: %v\n", authenticationError)
		sendErrorStringMessage(w, http.StatusUnauthorized, err, "incorrect login or password or login not exists")
		return
	}
	if decodeRequestError, ok := errors.AsType[*ogenerrors.DecodeRequestError](err); ok {
		log.Printf("DecodeRequestError: %v\n", decodeRequestError)
		sendErrorStringMessage(w, http.StatusBadRequest, err, decodeRequestError.Error())
		return
	}
	if securityError, ok := errors.AsType[*ogenerrors.SecurityError](err); ok {
		// security error means request did not reach JWT or Cookie auth handlers (they returns apperror),
		// so we can return 401
		log.Printf("SecurityError: %v\n", securityError)
		sendErrorStringMessage(w, http.StatusUnauthorized, securityError, "failed to read security credentials")
		return
	}
	fmt.Printf("error handler called with error: %T %+v\n", err, err.Error())
	_, _ = io.WriteString(w, http.StatusText(code))
}
func RegisterOgenRoutes(mux *http.ServeMux, cfg *config.AppConfig) {
	mediaR, err := mediaRepo.NewMediaRepo(cfg.Server.UploadDir)
	if err != nil {
		fmt.Printf("Failed to create media repo: %v\n", err)
		return
	}
	authR, err := authRepo.NewAuthRepo(cfg.Database.DSN())
	if err != nil {
		fmt.Printf("Failed to create auth repo: %v\n", err)
		return
	}
	userR, err := userRepo.NewUserRepo(cfg.Database.DSN())
	if err != nil {
		fmt.Printf("Failed to create storage: %v\n", err)
		return
	}
	commentR, err := commentsRepo.NewCommentsRepo(cfg.Database.DSN())
	if err != nil {
		panic(err)
	}
	postsR, err := postsRepo.NewPostsRepo(cfg.Database.DSN())
	if err != nil {
		panic(err)
	}
	analyticsR, err := analyticsRepo.NewAnalyticsRepo(cfg.Database.DSN())
	if err != nil {
		panic(err)
	}

	authS := authService.NewAuthService(authR, userR)
	userS := userService.NewUserService(userR, authR)
	mediaS := mediaService.NewMediaService(cfg.Server.BaseURL, mediaR)

	postsS := postsService.NewPostsService(postsR, commentR, userR)
	analyticsS := analyticsService.NewAnalyticsService(analyticsR)

	secure, sameSite := config.SessionCookieOpts(cfg.Server.BaseURL)
	authH := NewAuthHandler(authS, secure, sameSite)
	userH := NewUserHandler(userS)
	postsH := NewPostsHandler(postsS)
	mediaH := NewMediaHandler(mediaS)
	analyticsH := NewAnalyticsHandler(analyticsS)

	ogenHandler := NewOgenHandler(authH, userH, postsH, mediaH, analyticsH)
	secHandler := NewSecurityHandler(authR)

	errHandler := &errorHandler{}
	srv, err := api.NewServer(ogenHandler, secHandler, api.WithErrorHandler(errHandler.handler))
	if err != nil {
		panic(err)
	}
	apiHandler := WithGlobalContext(optionalCookieSession(authR, srv))

	fmt.Printf("cors enabled for origins %s\n", cfg.Server.PermittedOrigin)
	if len(cfg.Server.PermittedOrigin) > 0 {
		fmt.Printf("cors enabled for origins %s\n", cfg.Server.PermittedOrigin)
		corsHandler := cors.New(cors.Options{
			AllowedOrigins:   []string{cfg.Server.PermittedOrigin},
			AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowedHeaders:   []string{"Authorization", "Content-Type"},
			AllowCredentials: true,
		})
		apiHandler = corsHandler.Handler(apiHandler)
	}
	mux.Handle("/api/", apiHandler)
}

// Post handlers
func (h *OgenHandler) PostAddComment(
	ctx context.Context, req *api.PostCreateCommentRequest, params api.PostAddCommentParams) (
	api.PostAddCommentRes, error) {

	return h.postsHandler.PostAddComment(ctx, req, params)
}

func (h *OgenHandler) PostCreate(ctx context.Context, req *api.PostCreateRequest) (api.PostCreateRes, error) {
	return h.postsHandler.PostCreate(ctx, req)
}

func (h *OgenHandler) PostGet(ctx context.Context, params api.PostGetParams) (api.PostGetRes, error) {
	return h.postsHandler.PostGet(ctx, params)
}

func (h *OgenHandler) PostsList(ctx context.Context, params api.PostsListParams) (api.PostsListRes, error) {
	return h.postsHandler.PostsList(ctx, params)
}

// User handlers

func (h *OgenHandler) UserGet(ctx context.Context, params api.UserGetParams) (api.UserGetRes, error) {
	return h.userHandler.UserGet(ctx, params)
}

func (h *OgenHandler) UserMe(ctx context.Context) (api.UserMeRes, error) {
	return h.userHandler.UserMe(ctx)
}

func (h *OgenHandler) UserCreate(ctx context.Context, req *api.UserCreateRequest) (api.UserCreateRes, error) {
	return h.userHandler.UserCreate(ctx, req)
}

func (h *OgenHandler) UserUpdate(ctx context.Context, req *api.UserUpdateRequest, params api.UserUpdateParams) (*api.UserCreateResponse, error) {
	return h.userHandler.UserUpdate(ctx, req, params)
}

// Auth handlers

func (h *OgenHandler) AuthLogin(ctx context.Context, req *api.AuthLoginRequest) (api.AuthLoginRes, error) {
	return h.authHandler.AuthLogin(ctx, req)
}
func (h *OgenHandler) AuthLogout(ctx context.Context) error {
	return h.authHandler.AuthLogout(ctx)
}
func (h *OgenHandler) MediaUpload(ctx context.Context, req *api.MediaUploadRequestMultipart) (api.MediaUploadRes, error) {
	return h.mediaHandler.MediaUpload(ctx, req)
}

func (h *OgenHandler) AnalyticsVisitBatchSubmit(ctx context.Context, req *api.AnalyticsVisitBatchRequest) (api.AnalyticsVisitBatchSubmitRes, error) {
	return h.analyticsHandler.AnalyticsVisitBatchSubmit(ctx, req)
}

func (h *OgenHandler) AnalyticsMetricsGet(ctx context.Context, params api.AnalyticsMetricsGetParams) (api.AnalyticsMetricsGetRes, error) {
	return h.analyticsHandler.AnalyticsMetricsGet(ctx, params)
}
