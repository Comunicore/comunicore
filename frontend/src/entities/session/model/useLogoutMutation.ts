'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from './auth.store';

import {
  authLogoutMutation,
  userMeOptions,
} from '@/shared/api/generated/@tanstack/react-query.gen';
import { AppRouter } from '@/shared/config/app-router';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const authActions = useAuthStore((s) => s.actions);

  const router = useRouter();

  return useMutation({
    ...authLogoutMutation(),
    onSuccess: () => {
      authActions.logout();

      queryClient.removeQueries({ queryKey: userMeOptions().queryKey });

      router.push(AppRouter.main);
    },
  });
};
