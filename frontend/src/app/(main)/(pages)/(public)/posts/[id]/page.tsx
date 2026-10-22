'use client';

import { use } from 'react';
import { usePathname } from 'next/navigation';

import { POST_ID_PLACEHOLDER, resolvePostId } from './model/post-route';
import { isValidPostId, usePostDetails } from './model/usePostDetails';
import useRelatedPosts from './model/useRelatedPosts';
import PostActions from './ui/PostActions';
import PostArticle from './ui/PostArticle';
import PostSidebar from './ui/PostSidebar';

import { PostComments } from '@/widgets/post-comments';

import { AppRouter } from '@/shared/config/app-router';
import { cn } from '@/shared/lib/classNames';
import { Container, Loader, ViewAllLink } from '@/shared/ui';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  const { id: routeId } = use(params);
  const pathname = usePathname();
  const postId = resolvePostId(pathname, routeId);
  const isPostIdValid = isValidPostId(postId);
  const { data: post, isPending, isError } = usePostDetails(postId);
  const { data: relatedPosts = [] } = useRelatedPosts(postId, post?.category);

  const isResolvingRoute = routeId === POST_ID_PLACEHOLDER && !isPostIdValid;

  if (isResolvingRoute || (isPostIdValid && isPending)) {
    return (
      <Container className='flex justify-center py-24'>
        <Loader fullScreen />
      </Container>
    );
  }

  if (isError || !post) {
    return (
      <Container className='flex flex-col items-center gap-y-5 py-24 text-center'>
        <h1 className='text-2xl font-bold'>Не удалось загрузить пост</h1>
        <p className='text-gray-9e'>
          Возможно, он был удалён или ссылка неверна.
        </p>
        <ViewAllLink href={AppRouter.posts.root} label='Ко всем постам' />
      </Container>
    );
  }

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
          category={post.category}
        />
        <PostActions likesCount={post.likesCount} />
        <PostComments
          postId={post.id}
          comments={post.comments}
          commentsCount={post.commentsCount}
        />
      </div>

      <PostSidebar
        author={post.author}
        category={post.category}
        commentsCount={post.commentsCount}
        viewsCount={post.viewsCount}
        createdAt={post.createdAt}
        lastCommentAt={post.lastCommentAt}
        relatedPosts={relatedPosts}
      />
    </Container>
  );
}
