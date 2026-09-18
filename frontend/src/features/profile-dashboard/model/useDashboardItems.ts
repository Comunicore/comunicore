import { useQuery } from '@tanstack/react-query';

import { mockDashboard } from './mock-dashboard';
import { MockDashboardTypes } from './mock-dashbooard.types';

export const useDashboardItems = () => {
  const { data, ...queries } = useQuery<MockDashboardTypes>({
    queryKey: ['user', 'dashboard'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return mockDashboard;
    },
    retry: 0,
  });

  return {
    dashboardItems: data ?? null,
    ...queries,
  };
};
