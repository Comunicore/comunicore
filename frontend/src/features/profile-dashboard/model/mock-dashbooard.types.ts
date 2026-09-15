import { DashboardEntitiesTypes } from './dashboard-entities.types';
import { DashboardItemTypes } from './dashboard-item.types';

export type MockDashboardTypes = Record<
  DashboardEntitiesTypes,
  DashboardItemTypes[]
>;
