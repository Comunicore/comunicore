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
	testPostGet(t, globalConfig.URL, sessionCookie, post, comment, 1)

	user2 := testUserCreateOk(t, globalConfig.URL)
	sessionCookie2 := testAuthLoginOk(t, globalConfig.URL, user2)
	post2 := testPostCreateOk(t, globalConfig.URL, sessionCookie2)
	comment2 := testPostCommentCreateOk(t, globalConfig.URL, sessionCookie2, post2.ID)
	testPostGet(t, globalConfig.URL, sessionCookie2, post2, comment2, 1)
}

type MessageAuthor struct {
	ID          int    `json:"id"`
	Username    string `json:"username"`
	DisplayName string `json:"displayName"`
	// AvatarUrl   *url.URL
	Rank int `json:"rank"`
}
type PostStats struct {
	CommentsCount int `json:"commentsCount"`
	LikesCount    int `json:"likesCount"`
	ViewsCount    int `json:"viewsCount"`
}
type PostItem struct {
	ID        int    `json:"id"`
	UUID      string `json:"uuid"`
	Category  string `json:"category"`
	Author    MessageAuthor
	Title     string    `json:"title"`
	ContentMd string    `json:"contentMd"`
	PostStats PostStats `json:"postStats"`
	CreatedAt time.Time `json:"createdAt"`
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

		res.Keys().ContainsAny(
			"id", "uuid", "category", "author", "title",
			"contentMd", "files", "postStats", "createdAt",
		)
		res.Value("id").Number().Gt(0)
		res.Value("uuid").String().NotEmpty()
		res.Value("category").String().NotEmpty()
		// res.Value("authorAvatarUrl").String().NotEmpty()
		res.Value("title").String().HasPrefix("Test Post ")
		res.Value("contentMd").String().HasPrefix("This is a test post content ")
		res.Value("createdAt").String().NotEmpty()

		author := res.Value("author").Object()
		author.Keys().ContainsAny("id", "username", "displayName", "rank", "avatarUrl")
		author.Value("id").Number().Gt(0)
		author.Value("username").String().NotEmpty()
		author.Value("displayName").String().NotEmpty()
		author.Value("rank").Number().Ge(0)

		postStats := res.Value("postStats").Object()
		postStats.Keys().ContainsOnly("commentsCount", "likesCount", "viewsCount")
		postStats.Value("commentsCount").Number().IsEqual(0)
		postStats.Value("likesCount").Number().Ge(0)
		postStats.Value("viewsCount").Number().Ge(0)

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

		res.Keys().ContainsOnly("id", "author", "contentMd", "createdAt")
		res.Value("id").Number().Gt(0)
		res.Value("contentMd").String().IsEqual(postContent)
		res.Value("createdAt").String().NotEmpty()

		author := res.Value("author").Object()
		author.Keys().ContainsAny("id", "username", "displayName", "rank", "avatarUrl")
		author.Value("id").Number().Gt(0)
		author.Value("username").String().NotEmpty()
		author.Value("displayName").String().NotEmpty()
		author.Value("rank").Number().Ge(0)

		res.Decode(&comment)
	})

	return comment
}

type PostCommentItem struct {
	ID        int `json:"id"`
	Author    MessageAuthor
	ContentMd string    `json:"contentMd"`
	CreatedAt time.Time `json:"createdAt"`
}

func testPostGet(t *testing.T, baseURL string,
	cookie *http.Cookie, expectedPost PostItem, expectedComment PostCommentItem, commentsCount int) {

	t.Run("Test PostGet OK", func(t *testing.T) {
		exp := expectCreate(t, baseURL)
		auth := exp.Builder(func(req *httpexpect.Request) {
			req.WithCookie(sessionCookieName, cookie.Value)
		})

		res := auth.GET("/api/posts/{postId}", expectedPost.ID).
			Expect().
			Status(http.StatusOK).JSON().Object()

		res.Keys().ContainsOnly(
			"id", "uuid", "category", "author", "title", "contentMd", "postStats", "createdAt", "comments")
		res.Value("id").Number().IsEqual(expectedPost.ID)
		res.Value("uuid").String().IsEqual(expectedPost.UUID)
		res.Value("category").String().IsEqual(expectedPost.Category)
		res.Value("title").String().IsEqual(expectedPost.Title)
		res.Value("contentMd").String().IsEqual(expectedPost.ContentMd)
		res.Value("createdAt").String().NotEmpty()

		author := res.Value("author").Object()
		author.Keys().ContainsAny("id", "username", "displayName", "rank", "avatarUrl")
		author.Value("id").Number().IsEqual(expectedPost.Author.ID)
		author.Value("username").String().IsEqual(expectedPost.Author.Username)
		author.Value("displayName").String().IsEqual(expectedPost.Author.Username)
		author.Value("rank").Number().Ge(0)

		postStats := res.Value("postStats").Object()
		postStats.Keys().ContainsOnly("commentsCount", "likesCount", "viewsCount")
		postStats.Value("commentsCount").Number().IsEqual(commentsCount)
		postStats.Value("likesCount").Number().Ge(0)
		postStats.Value("viewsCount").Number().Ge(0)

		comments := res.Value("comments").Array()
		comments.Length().IsEqual(commentsCount)

		firstComment := comments.Value(0).Object()
		firstComment.Keys().ContainsOnly("id", "author", "contentMd", "createdAt")
		firstComment.Value("id").Number().IsEqual(expectedComment.ID)

		firstComment.Value("contentMd").String().IsEqual(expectedComment.ContentMd)
		firstComment.Value("createdAt").String().NotEmpty()

		author = res.Value("author").Object()
		author.Keys().ContainsAny("id", "username", "displayName", "rank", "avatarUrl")
		author.Value("id").Number().IsEqual(expectedComment.Author.ID)
		author.Value("username").String().IsEqual(expectedComment.Author.Username)
		author.Value("displayName").String().IsEqual(expectedPost.Author.Username)
		// author.Value("authorAvatarUrl").String().IsEqual(expectedComment.Author.AvatarUrl)
		author.Value("rank").Number().Ge(0)
	})
}
