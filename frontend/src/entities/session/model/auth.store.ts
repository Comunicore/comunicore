'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { AuthStore } from './auth-store';

export const useAuthStore = create<AuthStore>()(
  immer((set) => ({
    status: 'loading',

    actions: {
      logout: () => {
        set((state) => {
          state.status = 'anonymous';
        });
      },

      setStatus: (status) =>
        set((state) => {
          state.status = status;
        }),
    },
  })),
);
