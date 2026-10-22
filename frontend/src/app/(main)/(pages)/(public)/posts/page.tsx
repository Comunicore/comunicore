import { Suspense } from 'react';

import PostsHeader from './_ui/PostsHeader';

import { PostsSection } from '@/widgets/posts-section';

import { containerClassName } from '@/shared/ui/Container';
import { Loader } from '@/shared/ui/Loader';

export default function PostsPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-svh flex-col items-center gap-y-4 pt-[10svh]'>
          <Loader size='sm' />
        </div>
      }
    >
      <section className={`${containerClassName} grid gap-y-18.5 py-21.25`}>
        <PostsHeader />
        <PostsSection />
      </section>
    </Suspense>
  );
}
