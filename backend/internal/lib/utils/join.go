// SPDX-License-Identifier: MIT
// Copyright 2026 Alex Syrnikov <alex19srv@gmail.com>

package utils

import (
	"sync"
)

// manual join helper function
// usage example:
// You have a list of posts and you want to get a list of authors for those posts.
// You can use this function to
// -- extract the unique author IDs from the posts,
// -- then fetch the authors from the database or any other source,
// -- and finally join the posts with the authors to get a list of posts with author names.
// type Post struct {
// 	ID       int
// 	Content  string
// 	AuthorID int
// }
// type Author struct {
// 	ID   int
// 	Name string
// }
// type PostWithAuthor struct {
// 	Content    string
// 	AuthorName string
// }

// func main() {
// 	posts := getPosts() 			// will return []Post
//  // extract unique author IDs from posts
// 	authorIDs := ExtractFieldUnique(posts, func(p *Post) int { return p.AuthorID })
// 	authorsList := getAuthors(authorIDs)   // will return map[int]Author
// 	postsWithAuthors := joinPostsWithAuthors(posts, authorsList) // will return []PostWithAuthor
// }
// // join method must be implemented by user, for example:
// func joinPostsWithAuthors(posts []Post, authors map[int]Author) []PostWithAuthor {
// 	res := make([]PostWithAuthor, 0, len(posts))
// 	for _, post := range posts {
// 		resPost := PostWithAuthor{
// 			Content: post.Content,
// 		}
// 		author, exists := authors[post.AuthorID]
// 		if exists {
// 			resPost.AuthorName = author.Name
// 		}
// 		res = append(res, resPost)
// 	}
// 	return res
// }

var idMapPool = sync.Pool{
	New: func() any {
		return make(map[int]struct{})
	},
}

func ExtractFieldUnique[T any](list []T, getID func(*T) int) []int64 {
	idMap := idMapPool.Get().(map[int]struct{})
	defer func() {
		clear(idMap)
		idMapPool.Put(idMap)
	}()

	for i := range list {
		id := getID(&list[i])
		if _, exists := idMap[id]; exists {
			continue
		}
		idMap[id] = struct{}{}
	}

	ids := make([]int64, 0, len(idMap)) // TODO: get it from arena
	for id := range idMap {
		ids = append(ids, int64(id))
	}

	return ids
}
