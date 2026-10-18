import { PostDetailsData } from './post-details.types';

import { PostComment } from '@/widgets/post-comments';

import { mapMessageAuthorToPreview } from '@/entities/user';

import type {
  PostCommentItem,
  PostWithCommentsListResponse,
} from '@/shared/api/generated';

const byCreatedAt = (a: PostCommentItem, b: PostCommentItem) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

const mapComment = (comment: PostCommentItem): PostComment => ({
  id: String(comment.id),
  author: mapMessageAuthorToPreview(comment.author),
  text: comment.contentMd,
  isPending: comment.id < 0,
});

const mapPostDetails = (
  post: PostWithCommentsListResponse,
): PostDetailsData => {
  const comments = [...post.comments].sort(byCreatedAt);
  const savedComments = comments.filter(({ id }) => id > 0);

  return {
    id: post.id,
    title: post.title,
    content: post.contentMd,
    category: post.category,
    author: mapMessageAuthorToPreview(post.author),
    likesCount: post.postStats.likesCount,
    commentsCount: post.postStats.commentsCount,
    viewsCount: post.postStats.viewsCount,
    createdAt: post.createdAt,
    lastCommentAt: savedComments.at(-1)?.createdAt ?? null,
    comments: comments.map(mapComment),
  };
};

export default mapPostDetails;
