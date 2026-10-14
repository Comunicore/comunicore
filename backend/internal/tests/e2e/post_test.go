// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package e2e

import (
	"net/http"
	"testing"
	"time"

	"github.com/comunicore/comunicore/backend/internal/tests"
	"github.com/gavv/httpexpect/v2"
)

func TestPostCreate(t *testing.T) {
	user := testUserCreateOk(t, globalConfig.URL)
	sessionCookie := testAuthLoginOk(t, globalConfig.URL, user)
	post := testPostCreateOk(t, globalConfig.URL, sessionCookie)
	comment := testPostCommentCreateOk(t, globalConfig.URL, sessionCookie, post.ID)
	testPostGet(t, globalConfig.URL, sessionCookie, post, comment)

	user2 := testUserCreateOk(t, globalConfig.URL)
	sessionCookie2 := testAuthLoginOk(t, globalConfig.URL, user2)
	post2 := testPostCreateOk(t, globalConfig.URL, sessionCookie2)
	comment2 := testPostCommentCreateOk(t, globalConfig.URL, sessionCookie2, post2.ID)
	testPostGet(t, globalConfig.URL, sessionCookie2, post2, comment2)
}

type PostItem struct {
	ID              int       `json:"id"`
	Category        string    `json:"category"`
	AuthorID        int       `json:"authorId"`
	AuthorName      string    `json:"authorName"`
	AuthorAvatarUrl string    `json:"authorAvatarUrl"`
	Title           string    `json:"title"`
	ContentMd       string    `json:"contentMd"`
	CommentsCount   int       `json:"commentsCount"`
	CreatedAt       time.Time `json:"createdAt"`
}

func testPostCreateOk(t *testing.T, baseURL string, cookie *http.Cookie) PostItem {
	var post PostItem
	t.Run("Post create OK", func(t *testing.T) {
		exp := expectCreate(t, baseURL)
		auth := exp.Builder(func(req *httpexpect.Request) {
			req.WithCookie(sessionCookieName, cookie.Value)
		})

		res := auth.POST(postCreatePath).
			WithJSON(map[string]any{
				"category":  "Программирование",
				"title":     "Test Post " + tests.RandomString(8),
				"contentMd": "This is a test post content " + tests.RandomString(20),
			}).
			Expect().
			Status(http.StatusCreated).JSON().Object()

		res.Keys().ContainsOnly("id", "category", "authorId", "authorName", "authorAvatarUrl", "title",
			"contentMd", "commentsCount", "createdAt")
		res.Value("id").Number().Gt(0)
		res.Value("category").String().NotEmpty()
		res.Value("authorId").Number().Gt(0)
		res.Value("authorName").String().NotEmpty()
		// res.Value("authorAvatarUrl").String().NotEmpty()
		res.Value("title").String().HasPrefix("Test Post ")
		res.Value("contentMd").String().HasPrefix("This is a test post content ")
		res.Value("commentsCount").Number().IsEqual(0)
		res.Value("createdAt").String().NotEmpty()

		res.Decode(&post)
	})
	return post
}

func testPostCommentCreateOk(t *testing.T, baseURL string, cookie *http.Cookie, postId int) PostCommentItem {
	var comment PostCommentItem
	t.Run("Test PostCommentCreate OK", func(t *testing.T) {
		exp := expectCreate(t, baseURL)
		auth := exp.Builder(func(req *httpexpect.Request) {
			req.WithCookie(sessionCookieName, cookie.Value)
		})

		postContent := "This is a test comment content " + tests.RandomString(20)

		res := auth.POST(postCommentsPath, postId).
			WithJSON(map[string]any{
				"contentMd": postContent,
			}).
			Expect().
			Status(http.StatusCreated).JSON().Object()

		res.Keys().ContainsOnly("id", "authorId", "authorName", "authorAvatarUrl", "contentMd", "createdAt")
		res.Value("id").Number().Gt(0)
		res.Value("authorId").Number().Gt(0)
		res.Value("authorName").String().NotEmpty()
		// res.Value("authorAvatarUrl").String().NotEmpty()
		res.Value("contentMd").String().IsEqual(postContent)
		res.Value("createdAt").String().NotEmpty()

		res.Decode(&comment)
	})

	return comment
}

type PostCommentItem struct {
	ID              int       `json:"id"`
	AuthorID        int       `json:"authorId"`
	AuthorName      string    `json:"authorName"`
	AuthorAvatarUrl string    `json:"authorAvatarUrl"`
	ContentMd       string    `json:"contentMd"`
	CreatedAt       time.Time `json:"createdAt"`
}
type PostWithComments struct {
	Id              int               `json:"id"`
	Category        string            `json:"category"`
	AuthorID        int               `json:"authorId"`
	AuthorName      string            `json:"authorName"`
	AuthorAvatarUrl string            `json:"authorAvatarUrl"`
	Title           string            `json:"title"`
	ContentMd       string            `json:"contentMd"`
	PostsCount      int               `json:"postsCount"`
	CreatedAt       time.Time         `json:"createdAt"`
	Posts           []PostCommentItem `json:"posts"`
}

func testPostGet(t *testing.T, baseURL string,
	cookie *http.Cookie, expectedPost PostItem, expectedComment PostCommentItem) {

	t.Run("Test PostGet OK", func(t *testing.T) {
		exp := expectCreate(t, baseURL)
		auth := exp.Builder(func(req *httpexpect.Request) {
			req.WithCookie(sessionCookieName, cookie.Value)
		})

		res := auth.GET("/api/posts/{postId}", expectedPost.ID).
			Expect().
			Status(http.StatusOK).JSON().Object()

		res.Keys().ContainsOnly(
			"id", "category", "authorId", "authorName", "authorAvatarUrl", "title", "contentMd",
			"commentsCount", "createdAt", "comments")
		res.Value("id").Number().IsEqual(expectedPost.ID)
		res.Value("category").String().IsEqual(expectedPost.Category)
		res.Value("authorId").Number().IsEqual(expectedPost.AuthorID)
		res.Value("authorName").String().IsEqual(expectedPost.AuthorName)
		// res.Value("authorAvatarUrl").String().IsEqual(expectedPost.AuthorAvatarUrl)
		res.Value("title").String().IsEqual(expectedPost.Title)
		res.Value("contentMd").String().IsEqual(expectedPost.ContentMd)
		// One reply row exists in posts after postCommentCreateOk.
		res.Value("commentsCount").Number().IsEqual(1)
		res.Value("createdAt").String().NotEmpty()

		comments := res.Value("comments").Array()
		comments.Length().IsEqual(1)

		firstComment := comments.Value(0).Object()
		firstComment.Keys().ContainsOnly("id", "authorId", "authorName", "authorAvatarUrl", "contentMd", "createdAt")
		firstComment.Value("id").Number().IsEqual(expectedComment.ID)
		firstComment.Value("authorId").Number().IsEqual(expectedComment.AuthorID)
		firstComment.Value("authorName").String().IsEqual(expectedComment.AuthorName)
		firstComment.Value("authorAvatarUrl").String().IsEqual(expectedComment.AuthorAvatarUrl)
		firstComment.Value("contentMd").String().IsEqual(expectedComment.ContentMd)
		firstComment.Value("createdAt").String().NotEmpty()
	})
}
