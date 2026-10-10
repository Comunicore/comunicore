// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package posts

import (
	"context"

	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type PostsRepo interface {
	Create(ctx context.Context, post model.PostCreate) (model.PostRepoInfo, error)
	Get(ctx context.Context, postId int) (*model.PostRepoInfo, error)
	PageByPageID(ctx context.Context, page, limit int) (model.PostListRepo, error)
	PageByOffset(ctx context.Context, postId, limit int, before bool) (model.PostListRepo, error)
	InsertPostTags(ctx context.Context, postId int, tags []string) error
}
type CommentsRepo interface {
	Create(ctx context.Context, comment model.CommentCreate) (model.Comment, error)
	List(ctx context.Context, postId int) ([]model.Comment, error)
}
type UserRepo interface {
	GetNameById(ctx context.Context, userId int) (string, error)
	Get(ctx context.Context, userId int) (model.User, error)
}

type PostsService struct {
	postsRepo    PostsRepo
	commentsRepo CommentsRepo
	userRepo     UserRepo
}

func NewPostsService(postsRepo PostsRepo, commentsRepo CommentsRepo, userRepo UserRepo) *PostsService {
	return &PostsService{postsRepo: postsRepo, commentsRepo: commentsRepo, userRepo: userRepo}
}

func (s *PostsService) AddComment(ctx context.Context, comment model.CommentCreate) (model.CommentInfo, error) {
	createdComment, err := s.commentsRepo.Create(ctx, comment)
	if err != nil {
		return model.CommentInfo{}, err
	}
	userName, err := s.userRepo.GetNameById(ctx, createdComment.UserID)
	if err != nil {
		return model.CommentInfo{}, err
	}
	return model.CommentInfo{
		ID:        createdComment.ID,
		PostID:    createdComment.PostID,
		UserID:    createdComment.UserID,
		UserName:  userName,
		Content:   createdComment.Content,
		CreatedAt: createdComment.CreatedAt,
	}, nil
}
func (s *PostsService) Create(ctx context.Context, post model.PostCreate) (model.PostInfo, error) {
	createdPost, err := s.postsRepo.Create(ctx, post)
	if err != nil {
		return model.PostInfo{}, err
	}
	if len(post.Tags) > 0 {
		if err := s.postsRepo.InsertPostTags(ctx, createdPost.ID, post.Tags); err != nil {
			return model.PostInfo{}, err
		}
	}
	userName, err := s.userRepo.GetNameById(ctx, createdPost.UserID)
	if err != nil {
		return model.PostInfo{}, err
	}
	return model.PostInfo{
		ID:            createdPost.ID,
		Title:         createdPost.Title,
		Content:       createdPost.Content,
		UserID:        createdPost.UserID,
		UserName:      userName,
		CommentsCount: createdPost.CommentsCount,
		CreatedAt:     createdPost.CreatedAt,
	}, nil
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
			ID:              comment.ID,
			UserID:          comment.UserID,
			UserName:        userInfo.Name,
			AuthorAvatarUrl: userInfo.AvatarURL,
			Content:         comment.Content,
			CreatedAt:       comment.CreatedAt,
		})
	}
	userInfo, err := s.userRepo.Get(ctx, postInfo.UserID)
	if err != nil {
		return model.PostWithComments{}, err
	}
	return model.PostWithComments{
		ID:              postInfo.ID,
		AuthorID:        postInfo.UserID,
		AuthorName:      userInfo.Name,
		AuthorAvatarUrl: userInfo.AvatarURL,
		Title:           postInfo.Title,
		Content:         postInfo.Content,
		CommentsCount:   postInfo.CommentsCount,
		CreatedAt:       postInfo.CreatedAt,
		Comments:        commentListItems,
	}, nil
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
	ctx context.Context, postListRepo model.PostListRepo) (model.PostListResponse, error) {

	var postList []model.PostInfoResponse
	for _, post := range postListRepo.Posts {
		userInfo, err := s.userRepo.Get(ctx, post.UserID)
		if err != nil {
			return model.PostListResponse{}, err
		}
		postList = append(postList, model.PostInfoResponse{
			ID:              post.ID,
			Title:           post.Title,
			Content:         post.Content,
			AuthorID:        post.UserID,
			AuthorName:      userInfo.Name,
			AuthorAvatarUrl: userInfo.AvatarURL,
			CommentsCount:   post.CommentsCount,
			CreatedAt:       post.CreatedAt,
		})
	}
	return model.PostListResponse{
		Posts:               postList,
		TotalCountEstimated: postListRepo.TotalCountEstimated,
		HavePrev:            postListRepo.HavePrev,
		HaveNext:            postListRepo.HaveNext,
	}, nil
}
