'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LoginFormTypes } from '../schemas/login-form.schema';

import { useAuthStore } from '@/entities/session';

import {
  authLoginMutation,
  userMeOptions,
} from '@/shared/api/generated/@tanstack/react-query.gen';
import { AppRouter } from '@/shared/config/app-router';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const setStatus = useAuthStore((state) => state.actions.setStatus);

  const loginMutation = useMutation({
    ...authLoginMutation(),

    onMutate: () => {
      setStatus('loading');
    },

    onSuccess: async () => {
      setStatus('authenticated');

      await queryClient.invalidateQueries({
        queryKey: userMeOptions().queryKey,
      });

      router.push(`${AppRouter.profile.root}`);
    },

    onError: () => {
      setStatus('anonymous');
    },
  });

  return loginMutation;
};
