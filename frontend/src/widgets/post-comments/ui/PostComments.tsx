import { PostComment } from '../model/post-comment.types';

import { CommentThread } from './CommentThread';

interface PostCommentsProps {
  comments: PostComment[];
  commentsCount: number;
}

export function PostComments({ comments, commentsCount }: PostCommentsProps) {
  return (
    <>
      {/* TODO: отправка комментария */}
      <form className='flex'>
        <label htmlFor='post-comment' className='sr-only'>
          Комментарий
        </label>
        <input
          id='post-comment'
          name='comment'
          type='text'
          placeholder='Введите комментарий'
          autoComplete='off'
          className='border-gray-9e placeholder:text-gray-9e focus:border-purple-67 h-12.5 w-full rounded-[0.625rem] border bg-transparent px-2.5 text-lg font-medium outline-none'
        />
      </form>

      <section
        aria-labelledby='comments-heading'
        className='flex flex-col gap-y-10'
      >
        <h2
          id='comments-heading'
          className='text-2xl leading-normal font-bold sm:text-4xl'
        >
          Комментарии ({commentsCount})
        </h2>

        <ul className='bg-dark-0e border-gray-9e/10 flex flex-col gap-y-5 rounded-3xl border px-4 py-5 sm:rounded-[3.125rem]'>
          {comments.map((comment) => (
            <CommentThread key={comment.id} comment={comment} />
          ))}
        </ul>
      </section>
    </>
  );
}
