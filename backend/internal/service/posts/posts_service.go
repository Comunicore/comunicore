// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package posts

import (
	"context"

	"github.com/comunicore/comunicore/backend/internal/lib/utils"
	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type CategoryRepo interface {
	GetCategoryByID(ctx context.Context, id int64) (model.Category, error)
	GetCategoryByName(ctx context.Context, name string) (model.Category, error)
	GetDictByIDList(ctx context.Context, idList []int64) (map[int]model.Category, error)
	DefaultCategory() model.Category
}
type PostsRepo interface {
	Create(ctx context.Context, post model.PostCreateRepo) (model.PostRepoInfo, error)
	Get(ctx context.Context, postId int) (model.PostRepoInfo, error)
	PageByPageID(ctx context.Context, page, limit int) (model.PostListRepo, error)
	PageByOffset(ctx context.Context, postId, limit int, before bool) (model.PostListRepo, error)
	InsertPostTags(ctx context.Context, postId int, tags []string) error
}
type CommentsRepo interface {
	Create(ctx context.Context, comment model.CommentCreate) (model.Comment, error)
	List(ctx context.Context, postId int) ([]model.Comment, error)
}
type UserRepo interface {
	Get(ctx context.Context, userId int) (model.UserRepo, error)
}

type PostsService struct {
	categoryRepo CategoryRepo
	postsRepo    PostsRepo
	commentsRepo CommentsRepo
	userRepo     UserRepo
}

func NewPostsService(
	categoryRepo CategoryRepo,
	postsRepo PostsRepo,
	commentsRepo CommentsRepo,
	userRepo UserRepo,
) *PostsService {
	return &PostsService{
		categoryRepo: categoryRepo,
		postsRepo:    postsRepo,
		commentsRepo: commentsRepo,
		userRepo:     userRepo,
	}
}

func (s *PostsService) AddComment(ctx context.Context, comment model.CommentCreate) (model.CommentInfo, error) {
	createdComment, err := s.commentsRepo.Create(ctx, comment)
	if err != nil {
		return model.CommentInfo{}, err
	}
	userInfo, err := s.userRepo.Get(ctx, createdComment.UserID)
	if err != nil {
		return model.CommentInfo{}, err
	}
	commentInfo := model.CommentInfo{
		ID:       createdComment.ID,
		ParentID: createdComment.ParentID,
		PostID:   createdComment.PostID,
		Author: model.MessageAuthor{
			ID:          createdComment.UserID,
			Username:    userInfo.Name,
			DisplayName: userInfo.DisplayName,
			AvatarUrl:   userInfo.AvatarURL,
			Rank:        userInfo.Rank,
		},
		Content:   createdComment.Content,
		CreatedAt: createdComment.CreatedAt,
		UpdatedAt: createdComment.UpdatedAt,
	}
	return commentInfo, nil
}
func (s *PostsService) Create(ctx context.Context, post model.PostCreateService) (model.PostInfo, error) {
	category, err := s.categoryRepo.GetCategoryByName(ctx, post.Category)
	if err != nil {
		return model.PostInfo{}, err
	}
	createdPost, err := s.postsRepo.Create(ctx, model.PostCreateRepo{
		CategoryID: category.ID,
		Title:      post.Title,
		Content:    post.Content,
		UserID:     post.UserID,
		Tags:       post.Tags,
	})
	if err != nil {
		return model.PostInfo{}, err
	}
	if len(post.Tags) > 0 {
		if err := s.postsRepo.InsertPostTags(ctx, createdPost.ID, post.Tags); err != nil {
			return model.PostInfo{}, err
		}
	}

	userInfo, err := s.userRepo.Get(ctx, createdPost.UserID)
	if err != nil {
		return model.PostInfo{}, err
	}
	postInfo := model.PostInfo{
		ID:       createdPost.ID,
		UUID:     createdPost.UUID,
		Category: category.Name,
		Title:    createdPost.Title,
		Content:  createdPost.Content,
		Author: model.MessageAuthor{
			ID:          userInfo.ID,
			Username:    userInfo.Name,
			DisplayName: userInfo.DisplayName,
			AvatarUrl:   userInfo.AvatarURL,
			Rank:        userInfo.Rank,
		},
		Tags:      createdPost.Tags,
		PostStats: createdPost.PostStats,
		SeoMeta:   createdPost.SeoMeta,
		CreatedAt: createdPost.CreatedAt,
		UpdatedAt: createdPost.UpdatedAt,
	}
	return postInfo, nil
}

func (s *PostsService) GetPostWithComments(ctx context.Context, postId int) (model.PostWithComments, error) {
	postInfo, err := s.postsRepo.Get(ctx, postId)
	if err != nil {
		return model.PostWithComments{}, err
	}
	comments, err := s.commentsRepo.List(ctx, postId)
	if err != nil {
		return model.PostWithComments{}, err
	}
	var commentListItems []model.CommentListItem
	for _, comment := range comments {
		userInfo, err := s.userRepo.Get(ctx, comment.UserID)
		if err != nil {
			return model.PostWithComments{}, err
		}
		commentListItems = append(commentListItems, model.CommentListItem{
			ID:       comment.ID,
			ParentID: comment.ParentID,
			Author: model.MessageAuthor{
				ID:          userInfo.ID,
				Username:    userInfo.Name,
				DisplayName: userInfo.DisplayName,
				AvatarUrl:   userInfo.AvatarURL,
				Rank:        userInfo.Rank,
			},
			Content:   comment.Content,
			CreatedAt: comment.CreatedAt,
			UpdatedAt: comment.UpdatedAt,
		})
	}
	userInfo, err := s.userRepo.Get(ctx, postInfo.UserID)
	if err != nil {
		return model.PostWithComments{}, err
	}
	category, err := s.categoryRepo.GetCategoryByID(ctx, int64(postInfo.CategoryID))
	if err != nil {
		// TODO: log error
	}
	postWithComments := model.PostWithComments{
		ID:       postInfo.ID,
		UUID:     postInfo.UUID,
		Category: category.Name,
		Author: model.MessageAuthor{
			ID:          userInfo.ID,
			Username:    userInfo.Name,
			DisplayName: userInfo.DisplayName,
			AvatarUrl:   userInfo.AvatarURL,
			Rank:        userInfo.Rank,
		},
		Title:     postInfo.Title,
		Content:   postInfo.Content,
		Tags:      postInfo.Tags,
		PostStats: postInfo.PostStats,
		SeoMeta:   postInfo.SeoMeta,
		CreatedAt: postInfo.CreatedAt,
		UpdatedAt: postInfo.UpdatedAt,
		Comments:  commentListItems,
	}
	if category.ID == 0 {
		postWithComments.Category = s.categoryRepo.DefaultCategory().Name
	}
	return postWithComments, nil
}
func (s *PostsService) GetPostListByPage(ctx context.Context, page, limit int) (model.PostListResponse, error) {
	postListRepo, err := s.postsRepo.PageByPageID(ctx, page, limit)
	if err != nil {
		return model.PostListResponse{}, err
	}
	return s.convertPostListRepoToResponse(ctx, postListRepo)
}
func (s *PostsService) GetPostListByOffset(ctx context.Context, postId, limit int, before bool) (model.PostListResponse, error) {
	postListRepo, err := s.postsRepo.PageByOffset(ctx, postId, limit, before)
	if err != nil {
		return model.PostListResponse{}, err
	}
	return s.convertPostListRepoToResponse(ctx, postListRepo)
}
func (s *PostsService) convertPostListRepoToResponse(
	ctx context.Context, postListRepo model.PostListRepo,
) (model.PostListResponse, error,
) {
	postIdList := utils.ExtractFieldUnique(
		postListRepo.Posts,
		func(post *model.PostRepoInfo) int { return post.CategoryID },
	)
	categories, err := s.categoryRepo.GetDictByIDList(ctx, postIdList)
	if err != nil {
		// TODO: log error
	}

	var postList []model.PostInfoResponse
	for _, post := range postListRepo.Posts {
		userInfo, err := s.userRepo.Get(ctx, post.UserID)
		if err != nil {
			return model.PostListResponse{}, err
		}
		postInfoResponse := model.PostInfoResponse{
			ID:       post.ID,
			UUID:     post.UUID,
			Category: categories[post.CategoryID].Name,
			Title:    post.Title,
			Content:  post.Content,
			Author: model.MessageAuthor{
				ID:          userInfo.ID,
				Username:    userInfo.Name,
				DisplayName: userInfo.DisplayName,
				AvatarUrl:   userInfo.AvatarURL,
				Rank:        userInfo.Rank,
			},
			Tags:      post.Tags,
			PostStats: post.PostStats,
			SeoMeta:   post.SeoMeta,
			CreatedAt: post.CreatedAt,
			UpdatedAt: post.UpdatedAt,
		}
		_, exists := categories[post.CategoryID]
		if !exists {
			postInfoResponse.Category = s.categoryRepo.DefaultCategory().Name
		}
		postList = append(postList, postInfoResponse)
	}
	return model.PostListResponse{
		Posts:               postList,
		TotalCountEstimated: postListRepo.TotalCountEstimated,
		HavePrev:            postListRepo.HavePrev,
		HaveNext:            postListRepo.HaveNext,
	}, nil
}
