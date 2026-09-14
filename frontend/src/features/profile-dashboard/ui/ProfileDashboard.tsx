import { useDashboardItems } from '../model/hooks/useDashboardItems';

import { DashboardCard } from './components/dashboard-card/DashboardCard';
import { DashboardSkeleton } from './components/dashboard-skeleton/DashboardSkeleton';

import { User } from '@/entities/user';

import { AppRouter } from '@/shared/config/app-router';

export function ProfileDashboard(_: { userId: User['id'] }) {
  const { dashboardItems, isLoading, error, status } = useDashboardItems();

  if (isLoading || !dashboardItems) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className='flex items-center justify-center'>
        <p>
          <span className='text-2xl font-bold'>{status}:</span>
          {error.message}
        </p>
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-y-5'>
      <DashboardCard
        href={AppRouter.profile.threads}
        title='Активные треды'
        items={dashboardItems.activeThreads}
      />
      <DashboardCard
        href={AppRouter.profile.messages}
        title='Последние сообщения'
        items={dashboardItems.lastComments}
      />
      <DashboardCard
        href={AppRouter.profile.favorites}
        title='Закладки'
        items={dashboardItems.bookmarks}
      />
    </div>
  );
}
