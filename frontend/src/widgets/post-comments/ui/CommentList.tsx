import { memo } from 'react';

import { PostComment } from '../model/post-comment.types';

import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: PostComment[];
  onReply: (comment: PostComment) => void;
}

export const CommentList = memo(({ comments, onReply }: CommentListProps) => (
  <ul className='flex flex-col gap-y-5'>
    {comments.map((comment) => (
      <CommentItem key={comment.id} comment={comment} onReply={onReply} />
    ))}
  </ul>
));

CommentList.displayName = 'comment-list';
