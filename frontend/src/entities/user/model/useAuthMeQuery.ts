'use client';

import { useQuery } from '@tanstack/react-query';

import { userMeOptions } from '@/shared/api/generated/@tanstack/react-query.gen';

export const useAuthMeQuery = (options?: { enabled?: boolean }) => {
  const queries = useQuery({
    ...userMeOptions(),
    retry: false,
    ...options,
  });

  return queries;
};
