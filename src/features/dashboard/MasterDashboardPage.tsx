import React, { useEffect, useState, memo, useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setDashboardData, setTiemposAtencion, setLoading } from './dashboardSlice';
import {
  mockMetrics,
  mockAdvisors,
  mockBarChartData,
  mockLoadDistribution,
  mockTiemposAtencion,
} from '../../utils/mockData';
import FilterSection from '../filters/FilterSection';
import MasterDataTable from './MasterDataTable';
import ReportGenerationCards from './ReportGenerationCards';
import LoadingDashboard from '../../components/LoadingDashboard';
import AdvisorTable from './AdvisorTable';
import TiemposAtencionTable from './TiemposAtencionTable';
import MetricCards from './MetricCards';
import TiemposMetricCards from './TiemposMetricCards';
import LoadDistributionCard from './LoadDistributionCard';

const MasterDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.dashboard.isLoading);
  const [activeReport, setActiveReport] = useState<'conversaciones' | 'tiempos' | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeReport && previewRef.current) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [activeReport]);

  useEffect(() => {
    dispatch(setLoading(true));
    // Simulate API fetch delay for all required data
    const timer = setTimeout(() => {
      dispatch(
        setDashboardData({
          metrics: mockMetrics,
          advisors: mockAdvisors,
          chartData: mockBarChartData,
          loadDistribution: mockLoadDistribution,
        })
      );
      dispatch(setTiemposAtencion(mockTiemposAtencion));
      dispatch(setLoading(false));
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
            Consolidado Maestro de Datos
          </Heading>
          <Text color="brand.onSurfaceVariant" mt={1}>
            Vista unificada de métricas conversacionales, tiempos de atención y estructura jerárquica de interacciones.
          </Text>
        </Box>

        {/* Filters */}
        <FilterSection />

        {/* Master Table */}
        <MasterDataTable />

        {/* Report Generation Section */}
        <ReportGenerationCards onPreview={setActiveReport} activeReport={activeReport} />

        {/* Selected Report Preview Section */}
        <Box ref={previewRef}>
          {activeReport === 'conversaciones' && (
            <Box mb={8} animation="fadeIn 0.3s">
              <Text fontFamily="heading" fontSize="xl" fontWeight="bold" color="gray.900" mb={4}>
                Previsualización: Conversaciones
              </Text>
              <MetricCards />
              <AdvisorTable />
              <Box mt={6} maxW="full">
                <LoadDistributionCard />
              </Box>
            </Box>
          )}

          {activeReport === 'tiempos' && (
            <Box mb={8} animation="fadeIn 0.3s">
              <Text fontFamily="heading" fontSize="xl" fontWeight="bold" color="gray.900" mb={4}>
                Previsualización: Tiempos de Atención
              </Text>
              <TiemposMetricCards />
              <TiemposAtencionTable />
              <Box mt={6} maxW="full">
                <LoadDistributionCard />
              </Box>
            </Box>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default memo(MasterDashboardPage);
