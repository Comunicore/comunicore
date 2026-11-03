'use client';

import { AuthButtons } from './AuthButtons';

import { ProfileActions } from '@/features/profile-actions';

import { selectStatus, useAuthStore } from '@/entities/session';
import { useUser } from '@/entities/user';

import { cn } from '@/shared/lib/classNames';

interface Props {
  className?: string;
  skeletonClassName?: string;
}

/**
 * Блок авторизации в хедере: профиль, кнопки входа или скелетон.
 *
 * После полной перезагрузки страницы стор стартует со статусом 'loading'.
 * Переход на несуществующую страницу — всегда полная перезагрузка: RSC-запрос
 * получает 404, и Next уходит в обычную навигацию. Если показывать гостевые
 * кнопки, пока /user/me не ответил, залогиненный пользователь видит мигание
 * «Войти / Регистрация» вместо своей аватарки.
 */
export function AuthSlot({ className, skeletonClassName }: Props) {
  const status = useAuthStore(selectStatus);
  const isAuthenticated = status === 'authenticated';
  const { user, isError } = useUser({ enabled: isAuthenticated });

  // Интерцептор ставит 'authenticated' раньше, чем ответ /user/me попадёт в кэш
  // React Query, — без этой проверки на кадр мелькает «Anonym» без аватарки.
  const isUserPending = isAuthenticated && !user && !isError;

  if (status === 'loading' || isUserPending) {
    return (
      <div
        aria-hidden='true'
        className={cn(
          'bg-dark-1b animate-pulse rounded-[5px]',
          className,
          skeletonClassName,
        )}
      />
    );
  }

  return isAuthenticated ? (
    <ProfileActions className={className} />
  ) : (
    <AuthButtons className={className} />
  );
}
