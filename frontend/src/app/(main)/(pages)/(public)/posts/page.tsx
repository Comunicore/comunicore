import { Suspense } from 'react';

import { PostsSection } from '@/widgets/posts-section';

import { Container } from '@/shared/ui';

const PostsFallback = () => (
  <Container>
    <p>Loading...</p>
  </Container>
);

export default function PostsPage() {
  return (
    <Suspense fallback={<PostsFallback />}>
      <PostsSection />
    </Suspense>
  );
}
