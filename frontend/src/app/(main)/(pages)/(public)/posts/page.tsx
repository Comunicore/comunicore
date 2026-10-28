import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import PostsHeader from './_ui/PostsHeader';
import PostsHeaderSkeleton from './_ui/PostsHeaderSkeleton';

import { PostsSection } from '@/widgets/posts-section';

import { parsePostsParams } from '@/entities/post';

import { postsListOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import { getQueryClient } from '@/shared/api/query-client';
import { parseToSearchParams } from '@/shared/lib/helpers/parseToSearchParams';
import { Container } from '@/shared/ui/Container';

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = parsePostsParams(parseToSearchParams(sp));

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(postsListOptions({ query }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className='grid gap-y-18.5 py-21.25'>
        <Suspense fallback={<PostsHeaderSkeleton />}>
          <PostsHeader />
        </Suspense>

        <PostsSection />
      </Container>
    </HydrationBoundary>
  );
}
