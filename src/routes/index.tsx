import React, { lazy, Suspense } from 'react';
import LoadingDashboard from '../components/LoadingDashboard';

const MasterDashboardPage = lazy(() => import('../features/dashboard/MasterDashboardPage'));

const Routes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingDashboard />}>
      <MasterDashboardPage />
    </Suspense>
  );
};

export default Routes;
