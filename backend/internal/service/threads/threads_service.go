// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package threads

import (
	"context"

	"github.com/comunicore/comunicore/backend/internal/service/model"
)

type ThreadsRepo interface {
	Create(ctx context.Context, thread model.ThreadCreate) (model.ThreadRepoInfo, error)
	Get(ctx context.Context, threadId int) (*model.ThreadRepoInfo, error)
	PageByPageID(ctx context.Context, page, limit int) (model.ThreadListRepo, error)
	PageByOffset(ctx context.Context, threadId, limit int, before bool) (model.ThreadListRepo, error)
	InsertThreadTags(ctx context.Context, threadID int, tags []string) error
}
type CommentsRepo interface {
	Create(ctx context.Context, comment model.PostCreate) (model.Post, error)
	List(ctx context.Context, threadId int) ([]model.Post, error)
}
type UserRepo interface {
	GetNameById(ctx context.Context, userId int) (string, error)
	Get(ctx context.Context, userId int) (model.User, error)
}

type ThreadsService struct {
	threadsRepo  ThreadsRepo
	commentsRepo CommentsRepo
	userRepo     UserRepo
}

func NewThreadsService(threadsRepo ThreadsRepo, commentsRepo CommentsRepo, userRepo UserRepo) *ThreadsService {
	return &ThreadsService{threadsRepo: threadsRepo, commentsRepo: commentsRepo, userRepo: userRepo}
}

// deprecated: use AddComment instead
func (s *ThreadsService) AddPost(ctx context.Context, post model.PostCreate) (model.PostInfo, error) {
	createdPost, err := s.commentsRepo.Create(ctx, post)
	if err != nil {
		return model.PostInfo{}, err
	}
	userName, err := s.userRepo.GetNameById(ctx, createdPost.UserID)
	if err != nil {
		return model.PostInfo{}, err
	}
	return model.PostInfo{
		ID:        createdPost.ID,
		ThreadID:  createdPost.ThreadID,
		UserID:    createdPost.UserID,
		UserName:  userName,
		Content:   createdPost.Content,
		CreatedAt: createdPost.CreatedAt,
	}, nil
}
func (s *ThreadsService) AddComment(ctx context.Context, comment model.PostCreate) (model.PostInfo, error) {
	createdComment, err := s.commentsRepo.Create(ctx, comment)
	if err != nil {
		return model.PostInfo{}, err
	}
	userName, err := s.userRepo.GetNameById(ctx, createdComment.UserID)
	if err != nil {
		return model.PostInfo{}, err
	}
	return model.PostInfo{
		ID:        createdComment.ID,
		ThreadID:  createdComment.ThreadID,
		UserID:    createdComment.UserID,
		UserName:  userName,
		Content:   createdComment.Content,
		CreatedAt: createdComment.CreatedAt,
	}, nil
}
func (s *ThreadsService) Create(ctx context.Context, thread model.ThreadCreate) (model.ThreadInfo, error) {
	createdThread, err := s.threadsRepo.Create(ctx, thread)
	if err != nil {
		return model.ThreadInfo{}, err
	}
	if len(thread.Tags) > 0 {
		if err := s.threadsRepo.InsertThreadTags(ctx, createdThread.ID, thread.Tags); err != nil {
			return model.ThreadInfo{}, err
		}
	}
	userName, err := s.userRepo.GetNameById(ctx, createdThread.UserID)
	if err != nil {
		return model.ThreadInfo{}, err
	}
	return model.ThreadInfo{
		ID:            createdThread.ID,
		Title:         createdThread.Title,
		Content:       createdThread.Content,
		UserID:        createdThread.UserID,
		UserName:      userName,
		CommentsCount: createdThread.CommentsCount,
		CreatedAt:     createdThread.CreatedAt,
	}, nil
}

func (s *ThreadsService) GetThreadWithComments(ctx context.Context, threadId int) (model.ThreadWithComments, error) {
	threadInfo, err := s.threadsRepo.Get(ctx, threadId)
	if err != nil {
		return model.ThreadWithComments{}, err
	}
	comments, err := s.commentsRepo.List(ctx, threadId)
	if err != nil {
		return model.ThreadWithComments{}, err
	}
	var commentListItems []model.PostListItem
	for _, comment := range comments {
		userInfo, err := s.userRepo.Get(ctx, comment.UserID)
		if err != nil {
			return model.ThreadWithComments{}, err
		}
		commentListItems = append(commentListItems, model.PostListItem{
			ID:              comment.ID,
			UserID:          comment.UserID,
			UserName:        userInfo.Name,
			AuthorAvatarUrl: userInfo.AvatarURL,
			Content:         comment.Content,
			CreatedAt:       comment.CreatedAt,
		})
	}
	userInfo, err := s.userRepo.Get(ctx, threadInfo.UserID)
	if err != nil {
		return model.ThreadWithComments{}, err
	}
	return model.ThreadWithComments{
		ID:              threadInfo.ID,
		AuthorID:        threadInfo.UserID,
		AuthorName:      userInfo.Name,
		AuthorAvatarUrl: userInfo.AvatarURL,
		Title:           threadInfo.Title,
		Content:         threadInfo.Content,
		CommentsCount:   threadInfo.CommentsCount,
		CreatedAt:       threadInfo.CreatedAt,
		Posts:           commentListItems,
	}, nil
}
func (s *ThreadsService) GetThreadListByPage(ctx context.Context, page, limit int) (model.ThreadListResponse, error) {
	threadListRepo, err := s.threadsRepo.PageByPageID(ctx, page, limit)
	if err != nil {
		return model.ThreadListResponse{}, err
	}
	return s.convertThreadListRepoToResponse(ctx, threadListRepo)
}
func (s *ThreadsService) GetThreadListByOffset(ctx context.Context, threadId, limit int, before bool) (model.ThreadListResponse, error) {
	threadListRepo, err := s.threadsRepo.PageByOffset(ctx, threadId, limit, before)
	if err != nil {
		return model.ThreadListResponse{}, err
	}
	return s.convertThreadListRepoToResponse(ctx, threadListRepo)
}
func (s *ThreadsService) convertThreadListRepoToResponse(
	ctx context.Context, threadListRepo model.ThreadListRepo) (model.ThreadListResponse, error) {

	var threadList []model.ThreadInfoResponse
	for _, thread := range threadListRepo.Threads {
		userInfo, err := s.userRepo.Get(ctx, thread.UserID)
		if err != nil {
			return model.ThreadListResponse{}, err
		}
		threadList = append(threadList, model.ThreadInfoResponse{
			ID:              thread.ID,
			Title:           thread.Title,
			Content:         thread.Content,
			AuthorID:        thread.UserID,
			AuthorName:      userInfo.Name,
			AuthorAvatarUrl: userInfo.AvatarURL,
			CommentsCount:   thread.CommentsCount,
			CreatedAt:       thread.CreatedAt,
		})
	}
	return model.ThreadListResponse{
		Threads:             threadList,
		TotalCountEstimated: threadListRepo.TotalCountEstimated,
		HavePrev:            threadListRepo.HavePrev,
		HaveNext:            threadListRepo.HaveNext,
	}, nil
}
