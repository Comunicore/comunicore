'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  MessageAuthor,
  PostWithCommentsListResponse,
} from '@/shared/api/generated';
import {
  postAddCommentMutation,
  postGetQueryKey,
} from '@/shared/api/generated/@tanstack/react-query.gen';

interface AddCommentContext {
  previous?: PostWithCommentsListResponse;
}

export const useAddComment = (postId: number, author: MessageAuthor | null) => {
  const queryClient = useQueryClient();
  const queryKey = postGetQueryKey({ path: { postId } });
  const { mutationFn } = postAddCommentMutation();

  return useMutation({
    mutationFn,
    onMutate: async ({ body }): Promise<AddCommentContext> => {
      await queryClient.cancelQueries({ queryKey });

      const previous =
        queryClient.getQueryData<PostWithCommentsListResponse>(queryKey);

      if (previous && author) {
        queryClient.setQueryData<PostWithCommentsListResponse>(queryKey, {
          ...previous,
          postStats: {
            ...previous.postStats,
            commentsCount: previous.postStats.commentsCount + 1,
          },
          comments: [
            ...previous.comments,
            {
              id: -Date.now(),
              author,
              contentMd: body.contentMd,
              createdAt: new Date().toISOString(),
            },
          ],
        });
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
};
