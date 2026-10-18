'use client';

import { useQuery } from '@tanstack/react-query';

import mapPostDetails from './mapPostDetails';

import { postGetOptions } from '@/shared/api/generated/@tanstack/react-query.gen';

export const isValidPostId = (postId: number) =>
  Number.isInteger(postId) && postId > 0;

export const usePostDetails = (postId: number) =>
  useQuery({
    ...postGetOptions({ path: { postId } }),
    select: mapPostDetails,
    enabled: isValidPostId(postId),
  });
