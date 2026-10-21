// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package handler

import (
	"context"
	"net/url"
	"slices"

	"github.com/comunicore/comunicore/backend/internal/apperror"
	api "github.com/comunicore/comunicore/backend/internal/handler/generated"
	"github.com/comunicore/comunicore/backend/internal/service/model"
	postsService "github.com/comunicore/comunicore/backend/internal/service/posts"
	"github.com/samber/mo"
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
	commentToCreate := model.CommentCreate{
		PostID:  params.PostId,
		UserID:  globalCtx.UserID,
		Content: req.ContentMd,
	}
	if req.ParentCommentId.IsSet() {
		commentToCreate.ParentCommentID = req.ParentCommentId.Value
	}

	comment, err := h.postsService.AddComment(ctx, commentToCreate)
	if err != nil {
		return nil, err
	}
	apiComment := &api.PostCommentItem{
		ID: comment.ID,
		Author: api.MessageAuthor{
			ID:          comment.Author.ID,
			Username:    comment.Author.Username,
			DisplayName: comment.Author.DisplayName,
			Rank:        float64(comment.Author.Rank),
		},
		ContentMd: comment.Content,
		CreatedAt: comment.CreatedAt,
	}
	if comment.ParentID != 0 {
		apiComment.ParentCommentId.SetTo(comment.ParentID)
	}
	if !comment.UpdatedAt.IsZero() {
		apiComment.UpdatedAt.SetTo(comment.UpdatedAt)
	}
	if comment.Author.AvatarUrl != nil {
		apiComment.Author.AvatarUrl.SetTo(*comment.Author.AvatarUrl)
	}
	return apiComment, nil
}

func (h *PostsHandler) PostCreate(
	ctx context.Context, req *api.PostCreateRequest) (api.PostCreateRes, error) {

	globalCtx := GlobalContextFromContext(ctx)
	if globalCtx == nil || globalCtx.UserIDIsSet == false {
		res := api.PostCreateInternalServerError("in handler.PostCreate() user ID is not set")
		return &res, apperror.NewAuthenticationError("handler.PostCreate()", nil, "user ID is not set")
	}
	modelPostCreate := model.PostCreateService{
		Category: req.Category,
		Type:     string(req.Type),
		Title:    req.Title,
		Content:  req.ContentMd,
		Files:    mo.None[[]url.URL](),
		UserID:   globalCtx.UserID,
		Tags:     req.Tags,
	}
	if len(req.Files) > 0 {
		modelPostCreate.Files = mo.Some(req.Files)
	}

	post, err := h.postsService.Create(ctx, modelPostCreate)
	if err != nil {
		return nil, err
	}
	apiPost := &api.PostItem{
		ID:        post.ID,
		UUID:      post.UUID,
		Category:  post.Category,
		Type:      post.Type,
		Title:     post.Title,
		ContentMd: post.Content,
		Author: api.MessageAuthor{
			ID:          post.Author.ID,
			Username:    post.Author.Username,
			DisplayName: post.Author.DisplayName,
			Rank:        float64(post.Author.Rank),
		},
		Tags: post.Tags,
		PostStats: api.PostStats{
			CommentsCount: post.PostStats.CommentsCount,
			LikesCount:    post.PostStats.LikesCount,
			ViewsCount:    post.PostStats.ViewsCount,
		},
		CreatedAt: post.CreatedAt,
	}
	if !post.UpdatedAt.IsZero() {
		apiPost.UpdatedAt.SetTo(post.UpdatedAt)
	}
	if post.Author.AvatarUrl != nil {
		apiPost.Author.AvatarUrl.SetTo(*post.Author.AvatarUrl)
	}
	if !post.SeoMeta.IsEmpty() {
		apiPost.SeoMeta.SetTo(apiSeoMetaFromModel(&post.SeoMeta))
	}
	if files, ok := post.Files.Get(); ok {
		apiPost.Files = files
	}
	return apiPost, nil
}

func apiSeoMetaFromModel(seo *model.SeoMeta) api.SeoMeta {
	res := api.SeoMeta{
		Keywords: seo.Keywords,
	}
	if seo.OgImageUrl != nil {
		res.OgImageUrl.SetTo(*seo.OgImageUrl)
	}
	if seo.Description != "" {
		res.Description.SetTo(seo.Description)
	}

	return res
}

// get post with all comments
func (h *PostsHandler) PostGet(ctx context.Context, params api.PostGetParams) (api.PostGetRes, error) {
	postWithComments, err := h.postsService.GetPostWithComments(ctx, params.PostId)
	if err != nil {
		return nil, err
	}
	var comments []api.PostCommentItem
	for _, commentModel := range postWithComments.Comments {
		apiComment := api.PostCommentItem{
			ID: commentModel.ID,
			Author: api.MessageAuthor{
				ID:          commentModel.Author.ID,
				Username:    commentModel.Author.Username,
				DisplayName: commentModel.Author.DisplayName,
				Rank:        float64(commentModel.Author.Rank),
			},
			ContentMd: commentModel.Content,
			CreatedAt: commentModel.CreatedAt,
		}
		if commentModel.ParentID != 0 {
			apiComment.ParentCommentId.SetTo(commentModel.ParentID)
		}
		if !commentModel.UpdatedAt.IsZero() {
			apiComment.UpdatedAt.SetTo(commentModel.UpdatedAt)
		}
		if commentModel.Author.AvatarUrl != nil {
			apiComment.Author.AvatarUrl.SetTo(*commentModel.Author.AvatarUrl)
		}
		comments = append(comments, apiComment)
	}
	slices.SortFunc(comments, func(a, b api.PostCommentItem) int {
		return a.CreatedAt.Compare(b.CreatedAt)
	})
	apiPost := &api.PostWithCommentsListResponse{
		ID:       postWithComments.ID,
		UUID:     postWithComments.UUID,
		Category: postWithComments.Category,
		Type:     postWithComments.Type,
		Author: api.MessageAuthor{
			ID:          postWithComments.Author.ID,
			Username:    postWithComments.Author.Username,
			DisplayName: postWithComments.Author.DisplayName,
			Rank:        float64(postWithComments.Author.Rank),
		},
		Title:     postWithComments.Title,
		ContentMd: postWithComments.Content,
		Tags:      postWithComments.Tags,
		PostStats: api.PostStats{
			CommentsCount: postWithComments.PostStats.CommentsCount,
			LikesCount:    postWithComments.PostStats.LikesCount,
			ViewsCount:    postWithComments.PostStats.ViewsCount,
		},
		CreatedAt: postWithComments.CreatedAt,
		Comments:  comments,
	}
	if !postWithComments.UpdatedAt.IsZero() {
		apiPost.UpdatedAt.SetTo(postWithComments.UpdatedAt)
	}
	if postWithComments.Author.AvatarUrl != nil {
		apiPost.Author.AvatarUrl.SetTo(*postWithComments.Author.AvatarUrl)
	}
	if !postWithComments.SeoMeta.IsEmpty() {
		apiPost.SeoMeta.SetTo(apiSeoMetaFromModel(&postWithComments.SeoMeta))
	}
	if files, ok := postWithComments.Files.Get(); ok {
		apiPost.Files = files
	}

	return apiPost, nil
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
			ID:       post.ID,
			UUID:     post.UUID,
			Category: post.Category,
			Type:     post.Type,
			Title:    post.Title,
			Author: api.MessageAuthor{
				ID:          post.Author.ID,
				Username:    post.Author.Username,
				DisplayName: post.Author.DisplayName,
				Rank:        float64(post.Author.Rank),
			},
			Tags: post.Tags,
			PostStats: api.PostStats{
				CommentsCount: post.PostStats.CommentsCount,
				LikesCount:    post.PostStats.LikesCount,
				ViewsCount:    post.PostStats.ViewsCount,
			},
			CreatedAt: post.CreatedAt,
		}
		if !post.UpdatedAt.IsZero() {
			resPosts[i].UpdatedAt.SetTo(post.UpdatedAt)
		}
		if post.Author.AvatarUrl != nil {
			resPosts[i].Author.AvatarUrl.SetTo(*post.Author.AvatarUrl)
		}
		if !post.SeoMeta.IsEmpty() {
			resPosts[i].SeoMeta.SetTo(apiSeoMetaFromModel(&post.SeoMeta))
		}
		if files, ok := post.Files.Get(); ok {
			resPosts[i].Files = files
		}
	}
	return &api.PostListResponse{
		Posts:               resPosts,
		TotalCountEstimated: postsList.TotalCountEstimated,
		HavePrev:            postsList.HavePrev,
		HaveNext:            postsList.HaveNext,
	}, nil
}
