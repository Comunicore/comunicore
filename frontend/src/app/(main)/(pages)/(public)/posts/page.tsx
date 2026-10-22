import PostsHeader from './_ui/PostsHeader';

import { PostsSection } from '@/widgets/posts-section';

import { containerClassName } from '@/shared/ui/Container';

export default function PostsPage() {
  return (
    <section className={`${containerClassName} grid gap-y-18.5 py-21.25`}>
      <PostsHeader />
      <PostsSection />
    </section>
  );
}
