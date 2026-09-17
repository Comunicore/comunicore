'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@/entities/session';

import { userCreateMutation } from '@/shared/api/generated/@tanstack/react-query.gen';
import { AppRouter } from '@/shared/config/app-router';
import { getErrorMessage } from '@/shared/lib/helpers/getErrorMessage';

export const useRegistration = () => {
  const router = useRouter();
  const authActions = useAuthStore((state) => state.actions);
  const registrationMutate = useMutation({
    ...userCreateMutation(),
    onSuccess: () => {
      // const email = variables.body.email;
      // const searchParams = new URLSearchParams({ email });
      authActions.setStatus('authenticated');

      router.push(`${AppRouter.profile.root}`);
    },
    onError: (error) => getErrorMessage(error),
  });

  return registrationMutate;
};
