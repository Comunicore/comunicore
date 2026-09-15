import { AppRouter } from '@/shared/config/app-router';
import { useMenuActions } from '@/shared/hooks/useMenu.selectors';
import { cn } from '@/shared/lib/classNames';
import { Button } from '@/shared/ui';

interface Props {
  className?: string;
}

export function AuthButtons({ className }: Props) {
  const setIsOpen = useMenuActions().setIsOpen;

  return (
    <div className={cn('flex gap-x-3', className)}>
      <Button
        onClick={() => setIsOpen(false)}
        href={AppRouter.auth.login}
        color='ghost'
        size='sm'
        className='bg-dark-1b'
      >
        Войти
      </Button>
      <Button
        onClick={() => setIsOpen(false)}
        href={AppRouter.auth.registration}
        size='sm'
      >
        Регистрация
      </Button>
    </div>
  );
}
