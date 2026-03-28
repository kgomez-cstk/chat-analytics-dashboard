import React, { lazy, Suspense } from 'react';
import LoadingDashboard from '../components/LoadingDashboard';
import { useAppSelector } from '../hooks/useRedux';

const DashboardPage = lazy(() => import('../features/dashboard/DashboardPage'));
const TiemposAtencionPage = lazy(() => import('../features/dashboard/TiemposAtencionPage'));

const Routes: React.FC = () => {
  const activePage = useAppSelector((state) => state.user.activePage);

  return (
    <Suspense fallback={<LoadingDashboard />}>
      {activePage === 'tiempos' ? <TiemposAtencionPage /> : <DashboardPage />}
    </Suspense>
  );
};

export default Routes;
