import { mockPostIds } from './model/mock-post';
import PostPageContent from './ui/PostPageContent';

import { postsList } from '@/widgets/posts-section';

export function generateStaticParams() {
  const ids = new Set([
    ...mockPostIds,
    ...postsList.map(({ id }) => String(id)),
  ]);

  return [...ids].map((id) => ({ id }));
}

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  return <PostPageContent postId={Number(id)} />;
}
