'use client';

import { useMemo } from 'react';

import type { ApiUser, ApiUserEnvelope } from './apiUser.types';
import type { AuthMeResponse } from './authMe.types';
import { mapApiUserToUser } from './mapApiUserToUser';
import { useAuthMeQuery } from './useAuthMeQuery';

type AuthMePayload = ApiUser | ApiUserEnvelope;

const isEnvelope = (data: AuthMePayload): data is ApiUserEnvelope =>
  'user' in data && typeof data.user === 'object' && data.user !== null;

const toAuthMeResponse = (data: AuthMePayload): AuthMeResponse =>
  isEnvelope(data)
    ? {
        accessToken: data.accessToken ?? '',
        user: mapApiUserToUser(data.user),
      }
    : { accessToken: '', user: mapApiUserToUser(data) };

export const useUser = (options?: { enabled?: boolean }) => {
  const { data, ...query } = useAuthMeQuery(options);

  const user = useMemo(() => (data ? toAuthMeResponse(data) : null), [data]);

  return {
    user,
    ...query,
  };
};
