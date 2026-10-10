import { mockPost, mockPostIds, mockRelatedPosts } from './model/mock-post';
import PostActions from './ui/PostActions';
import PostArticle from './ui/PostArticle';
import PostSidebar from './ui/PostSidebar';

import { PostComments } from '@/widgets/post-comments';
import { postsList } from '@/widgets/posts-section';

import { cn } from '@/shared/lib/classNames';
import { Container } from '@/shared/ui';

export function generateStaticParams() {
  const ids = new Set([
    ...mockPostIds,
    ...postsList.map(({ id }) => String(id)),
  ]);

  return [...ids].map((id) => ({ id }));
}

export default function PostPage() {
  // TODO: заменить на данные из API по id поста
  const post = mockPost;

  return (
    <Container
      className={cn(
        'grid gap-y-10 pt-11 pb-17',
        'xl:grid-cols-[1fr_25rem] xl:items-start xl:gap-x-5',
      )}
    >
      <div className='flex min-w-0 flex-col gap-y-10'>
        <PostArticle
          title={post.title}
          content={post.content}
          thread={post.thread}
          author={post.author}
        />
        <PostActions likesCount={post.likesCount} />
        <PostComments
          comments={post.comments}
          commentsCount={post.commentsCount}
        />
      </div>

      <PostSidebar
        author={post.author}
        topic={post.topic}
        repliesCount={post.repliesCount}
        viewsCount={post.viewsCount}
        createdAt={post.createdAt}
        lastReplyAt={post.lastReplyAt}
        relatedPosts={mockRelatedPosts}
      />
    </Container>
  );
}
