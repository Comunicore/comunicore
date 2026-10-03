// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package handler

import (
	"context"
	"net/url"

	"github.com/hetagdarchiev/comunicore/backend/internal/apperror"
	api "github.com/hetagdarchiev/comunicore/backend/internal/handler/generated"
	"github.com/hetagdarchiev/comunicore/backend/internal/service/model"
	threadsService "github.com/hetagdarchiev/comunicore/backend/internal/service/threads"
)

type ThreadsHandler struct {
	threadsService *threadsService.ThreadsService
}

func NewThreadsHandler(threadsService *threadsService.ThreadsService) *ThreadsHandler {
	return &ThreadsHandler{threadsService: threadsService}
}

// deprecated: use ThreadAddComment instead
func (h *ThreadsHandler) ThreadAddPost(
	ctx context.Context,
	req *api.ThreadCreatePostRequest,
	params api.ThreadAddPostParams) (api.ThreadAddPostRes, error) {

	globalCtx := GlobalContextFromContext(ctx)
	if globalCtx == nil || globalCtx.UserIDIsSet == false {
		res := api.ThreadAddPostInternalServerError("in handler.ThreadAddPost() user ID is not set")
		return &res, apperror.NewAuthenticationError("handler.ThreadAddPost()", nil, "user ID is not set")
	}
	postCreate := model.PostCreate{
		ThreadID: params.ThreadId,
		UserID:   globalCtx.UserID,
		Content:  req.Content,
	}

	post, err := h.threadsService.AddPost(ctx, postCreate)
	if err != nil {
		return nil, err
	}

	return &api.ThreadPostItem{
		ID:         post.ID,
		AuthorId:   post.UserID,
		AuthorName: post.UserName,
		Content:    post.Content,
		CreatedAt:  post.CreatedAt,
	}, nil
}
func (h *ThreadsHandler) ThreadAddComment(
	ctx context.Context,
	req *api.ThreadCreateCommentRequest,
	params api.ThreadAddCommentParams) (api.ThreadAddCommentRes, error) {

	globalCtx := GlobalContextFromContext(ctx)
	if globalCtx == nil || globalCtx.UserIDIsSet == false {
		res := api.ThreadAddCommentInternalServerError("in handler.ThreadAddComment() user ID is not set")
		return &res, apperror.NewAuthenticationError("handler.ThreadAddComment()", nil, "user ID is not set")
	}
	postCreate := model.PostCreate{
		ThreadID: params.ThreadId,
		UserID:   globalCtx.UserID,
		Content:  req.Content,
	}

	post, err := h.threadsService.AddComment(ctx, postCreate)
	if err != nil {
		return nil, err
	}

	return &api.ThreadCommentItem{
		ID:         post.ID,
		AuthorId:   post.UserID,
		AuthorName: post.UserName,
		Content:    post.Content,
		CreatedAt:  post.CreatedAt,
	}, nil
}

func (h *ThreadsHandler) ThreadCreate(
	ctx context.Context, req *api.ThreadCreateRequest) (api.ThreadCreateRes, error) {

	globalCtx := GlobalContextFromContext(ctx)
	if globalCtx == nil || globalCtx.UserIDIsSet == false {
		res := api.ThreadCreateInternalServerError("in handler.ThreadCreate() user ID is not set")
		return &res, apperror.NewAuthenticationError("handler.ThreadCreate()", nil, "user ID is not set")
	}
	modelThreadCreate := model.ThreadCreate{
		Title:   req.Title,
		Content: req.Content,
		UserID:  globalCtx.UserID,
		Tags:    req.Tags,
	}

	thread, err := h.threadsService.Create(ctx, modelThreadCreate)
	if err != nil {
		return nil, err
	}
	return &api.ThreadListItem{
		ID:            thread.ID,
		Title:         thread.Title,
		Content:       thread.Content,
		AuthorId:      thread.UserID,
		AuthorName:    thread.UserName,
		CommentsCount: thread.CommentsCount,
		CreatedAt:     thread.CreatedAt,
	}, nil
}

// get thread with all posts
func (h *ThreadsHandler) ThreadGet(ctx context.Context, params api.ThreadGetParams) (api.ThreadGetRes, error) {
	threadWithPosts, err := h.threadsService.GetThreadWithComments(ctx, params.ThreadId)
	if err != nil {
		return nil, err
	}
	var posts []api.ThreadPostItem
	for _, post := range threadWithPosts.Posts {
		avatarUrl, err := url.Parse(post.AuthorAvatarUrl)
		if err != nil {
			avatarUrl = nil
		}
		posts = append(posts, api.ThreadPostItem{
			ID:              post.ID,
			AuthorId:        post.UserID,
			AuthorName:      post.UserName,
			AuthorAvatarUrl: *avatarUrl,
			Content:         post.Content,
			CreatedAt:       post.CreatedAt,
		})
	}
	return &api.ThreadWithPostsListResponse{
		ID:            threadWithPosts.ID,
		AuthorId:      threadWithPosts.AuthorID,
		AuthorName:    threadWithPosts.AuthorName,
		Title:         threadWithPosts.Title,
		Content:       threadWithPosts.Content,
		PostsCount:    threadWithPosts.CommentsCount,
		CommentsCount: threadWithPosts.CommentsCount,
		CreatedAt:     threadWithPosts.CreatedAt,
		Posts:         posts,
	}, nil
}

func (h *ThreadsHandler) ThreadsList(ctx context.Context, params api.ThreadsListParams) (api.ThreadsListRes, error) {
	var limit = 20
	if params.Limit.IsSet() {
		limit = params.Limit.Value
	}
	var err error
	var threadList model.ThreadListResponse
	var threadId int
	page, ok := params.Page.Get()
	if ok {
		threadList, err = h.threadsService.GetThreadListByPage(ctx, page, limit)
		if err != nil {
			return nil, err
		}
		goto GOT_THREAD_ID
	}
	threadId, ok = params.Before.Get()
	if ok {
		threadList, err = h.threadsService.GetThreadListByOffset(ctx, threadId, limit, true)
		if err != nil {
			return nil, err
		}
		goto GOT_THREAD_ID
	}
	threadId, ok = params.After.Get()
	if ok {
		threadList, err = h.threadsService.GetThreadListByOffset(ctx, threadId, limit, false)
		if err != nil {
			return nil, err
		}
		goto GOT_THREAD_ID
	}
	threadList, err = h.threadsService.GetThreadListByPage(ctx, 1, limit)
	if err != nil {
		return nil, err
	}
GOT_THREAD_ID:
	resThreads := make([]api.ThreadListItem, len(threadList.Threads))
	for i, thread := range threadList.Threads {
		resThreads[i] = api.ThreadListItem{
			ID:            thread.ID,
			Title:         thread.Title,
			Content:       thread.Content,
			AuthorId:      thread.AuthorID,
			AuthorName:    thread.AuthorName,
			PostsCount:    thread.CommentsCount,
			CommentsCount: thread.CommentsCount,
			CreatedAt:     thread.CreatedAt,
		}
	}
	return &api.ThreadListResponse{
		Threads:             resThreads,
		TotalCountEstimated: threadList.TotalCountEstimated,
		HavePrev:            threadList.HavePrev,
		HaveNext:            threadList.HaveNext,
	}, nil
}
