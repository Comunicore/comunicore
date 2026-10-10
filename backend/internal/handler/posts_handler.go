// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package handler

import (
	"context"
	"net/url"

	"github.com/comunicore/comunicore/backend/internal/apperror"
	api "github.com/comunicore/comunicore/backend/internal/handler/generated"
	"github.com/comunicore/comunicore/backend/internal/service/model"
	postsService "github.com/comunicore/comunicore/backend/internal/service/posts"
)

type PostsHandler struct {
	postsService *postsService.PostsService
}

func NewPostsHandler(postsService *postsService.PostsService) *PostsHandler {
	return &PostsHandler{postsService: postsService}
}

func (h *PostsHandler) PostAddComment(
	ctx context.Context,
	req *api.PostCreateCommentRequest,
	params api.PostAddCommentParams) (api.PostAddCommentRes, error) {

	globalCtx := GlobalContextFromContext(ctx)
	if globalCtx == nil || globalCtx.UserIDIsSet == false {
		res := api.PostAddCommentInternalServerError("in handler.PostAddComment() user ID is not set")
		return &res, apperror.NewAuthenticationError("handler.PostAddComment()", nil, "user ID is not set")
	}
	postCreate := model.CommentCreate{
		PostID:  params.PostId,
		UserID:  globalCtx.UserID,
		Content: req.Content,
	}

	post, err := h.postsService.AddComment(ctx, postCreate)
	if err != nil {
		return nil, err
	}

	return &api.PostCommentItem{
		ID:         post.ID,
		AuthorId:   post.UserID,
		AuthorName: post.UserName,
		Content:    post.Content,
		CreatedAt:  post.CreatedAt,
	}, nil
}

func (h *PostsHandler) PostCreate(
	ctx context.Context, req *api.PostCreateRequest) (api.PostCreateRes, error) {

	globalCtx := GlobalContextFromContext(ctx)
	if globalCtx == nil || globalCtx.UserIDIsSet == false {
		res := api.PostCreateInternalServerError("in handler.PostCreate() user ID is not set")
		return &res, apperror.NewAuthenticationError("handler.PostCreate()", nil, "user ID is not set")
	}
	modelPostCreate := model.PostCreate{
		Title:   req.Title,
		Content: req.Content,
		UserID:  globalCtx.UserID,
		Tags:    req.Tags,
	}

	post, err := h.postsService.Create(ctx, modelPostCreate)
	if err != nil {
		return nil, err
	}
	return &api.PostListItem{
		ID:            post.ID,
		Title:         post.Title,
		Content:       post.Content,
		AuthorId:      post.UserID,
		AuthorName:    post.UserName,
		CommentsCount: post.CommentsCount,
		CreatedAt:     post.CreatedAt,
	}, nil
}

// get post with all comments
func (h *PostsHandler) PostGet(ctx context.Context, params api.PostGetParams) (api.PostGetRes, error) {
	postWithComments, err := h.postsService.GetPostWithComments(ctx, params.PostId)
	if err != nil {
		return nil, err
	}
	var comments []api.PostCommentItem
	for _, post := range postWithComments.Comments {
		avatarUrl, err := url.Parse(post.AuthorAvatarUrl)
		if err != nil {
			avatarUrl = nil
		}
		comments = append(comments, api.PostCommentItem{
			ID:              post.ID,
			AuthorId:        post.UserID,
			AuthorName:      post.UserName,
			AuthorAvatarUrl: *avatarUrl,
			Content:         post.Content,
			CreatedAt:       post.CreatedAt,
		})
	}
	return &api.PostWithCommentsListResponse{
		ID:            postWithComments.ID,
		AuthorId:      postWithComments.AuthorID,
		AuthorName:    postWithComments.AuthorName,
		Title:         postWithComments.Title,
		Content:       postWithComments.Content,
		CommentsCount: postWithComments.CommentsCount,
		CreatedAt:     postWithComments.CreatedAt,
		Comments:      comments,
	}, nil
}

func (h *PostsHandler) PostsList(ctx context.Context, params api.PostsListParams) (api.PostsListRes, error) {
	var limit = 20
	if params.Limit.IsSet() {
		limit = params.Limit.Value
	}
	var err error
	var postsList model.PostListResponse
	var postId int
	page, ok := params.Page.Get()
	if ok {
		postsList, err = h.postsService.GetPostListByPage(ctx, page, limit)
		if err != nil {
			return nil, err
		}
		goto GOT_POST_ID
	}
	postId, ok = params.Before.Get()
	if ok {
		postsList, err = h.postsService.GetPostListByOffset(ctx, postId, limit, true)
		if err != nil {
			return nil, err
		}
		goto GOT_POST_ID
	}
	postId, ok = params.After.Get()
	if ok {
		postsList, err = h.postsService.GetPostListByOffset(ctx, postId, limit, false)
		if err != nil {
			return nil, err
		}
		goto GOT_POST_ID
	}
	postsList, err = h.postsService.GetPostListByPage(ctx, 1, limit)
	if err != nil {
		return nil, err
	}
GOT_POST_ID:
	resPosts := make([]api.PostListItem, len(postsList.Posts))
	for i, post := range postsList.Posts {
		resPosts[i] = api.PostListItem{
			ID:            post.ID,
			Title:         post.Title,
			Content:       post.Content,
			AuthorId:      post.AuthorID,
			AuthorName:    post.AuthorName,
			PostsCount:    post.CommentsCount,
			CommentsCount: post.CommentsCount,
			CreatedAt:     post.CreatedAt,
		}
	}
	return &api.PostListResponse{
		Posts:               resPosts,
		TotalCountEstimated: postsList.TotalCountEstimated,
		HavePrev:            postsList.HavePrev,
		HaveNext:            postsList.HaveNext,
	}, nil
}
