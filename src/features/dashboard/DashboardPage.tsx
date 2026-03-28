import React, { useEffect, Suspense, memo } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  SimpleGrid,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setDashboardData, setLoading } from './dashboardSlice';
import {
  mockMetrics,
  mockAdvisors,
  mockBarChartData,
  mockLoadDistribution,
} from '../../utils/mockData';
import FilterSection from '../filters/FilterSection';
import MetricCards from './MetricCards';
import AdvisorTable from './AdvisorTable';
import LoadDistributionCard from './LoadDistributionCard';
import EfficiencyAnalysisCard from './EfficiencyAnalysisCard';
import DashboardCharts from './DashboardCharts';
import LoadingDashboard from '../../components/LoadingDashboard';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.dashboard.isLoading);

  useEffect(() => {
    dispatch(setLoading(true));
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      dispatch(
        setDashboardData({
          metrics: mockMetrics,
          advisors: mockAdvisors,
          chartData: mockBarChartData,
          loadDistribution: mockLoadDistribution,
        })
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (isLoading) return <LoadingDashboard />;

  return (
    <Container maxW="7xl" py={{ base: 6, lg: 10 }} px={{ base: 4, lg: 10 }}>
      <VStack spacing={8} align="stretch">
        {/* Page Header */}
        <Box>
          <Heading
            as="h2"
            fontFamily="heading"
            fontSize="3xl"
            fontWeight="bold"
            letterSpacing="tight"
            color="brand.onSurface"
          >
            Conversaciones
          </Heading>
          <Text color="brand.onSurfaceVariant" mt={1}>
            Reporte que muestra el volumen de conversaciones atendidas por cada asesor online, desglosando conversaciones únicas, masivas/vinculadas y el tiempo de línea vs. pausa.
          </Text>
        </Box>

        {/* Filters */}
        <FilterSection />

        {/* Metrics 
        */}
        <MetricCards />

        {/* Charts Section */}
        {/* <DashboardCharts /> */}
        <AdvisorTable />
        <LoadDistributionCard />
        {/* Main Data Section 
        
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <LoadDistributionCard />
          <EfficiencyAnalysisCard />
        </SimpleGrid>
        */}
      </VStack>
    </Container>
  );
};

export default memo(DashboardPage);
