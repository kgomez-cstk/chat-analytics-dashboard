import React, { useEffect, useState, useCallback, memo, useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  useToast,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchDashboardHoy } from './dashboardSlice';
import { fetchCatalogos } from '../filters/catalogosSlice';
import FilterSection from '../filters/FilterSection';
import MasterDataTable from './MasterDataTable';
import ReportGenerationCards from './ReportGenerationCards';
import LoadingDashboard from '../../components/LoadingDashboard';
import AdvisorTable from './AdvisorTable';
import TiemposAtencionTable from './TiemposAtencionTable';
import ConsolidatedMetrics from './ConsolidatedMetrics';
import LoadDistributionCard from './LoadDistributionCard';

const MasterDashboardPage: React.FC = () => {
  const dispatch      = useAppDispatch();
  const toast         = useToast();
  const isLoading     = useAppSelector((state) => state.dashboard.isLoading);
  const error         = useAppSelector((state) => state.dashboard.error);
  const catError      = useAppSelector((state) => state.catalogos.error);
  const queryMode     = useAppSelector((state) => state.filters.queryMode);
  const isInitialized = useAppSelector((state) => state.user.isInitialized);

  const [activeReport, setActiveReport] = useState<'conversaciones' | 'tiempos' | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // ── Cargar catálogos una vez al recibir el postMessage de inicialización ──
  useEffect(() => {
    if (isInitialized) {
      dispatch(fetchCatalogos());
    }
  }, [isInitialized, dispatch]);

  // ── Scroll al preview cuando se selecciona un reporte ────────────────────
  useEffect(() => {
    if (activeReport && previewRef.current) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [activeReport]);

  // ── Toast de error del dashboard ──────────────────────────────────────────
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error al cargar datos',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [error, toast]);

  // ── Toast de error de catálogos (parcial: algunos catálogos fallaron) ─────
  useEffect(() => {
    if (catError) {
      toast({
        title: 'Advertencia en catálogos',
        description: catError,
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [catError, toast]);

  /**
   * Botón BUSCAR:
   *   - queryMode 'today'  → llama al API de operaciones
   *   - queryMode 'range'  → pendiente de implementar
   * NUNCA se auto-llama al inicializar; espera la acción explícita del usuario.
   */
  const handleBuscar = useCallback(() => {
    dispatch(fetchDashboardHoy());
  }, [dispatch]);

  if (isLoading) return <LoadingDashboard />;

  return (
    <Container maxW="8xl" py={{ base: 6, lg: 10 }} px={{ base: 4, lg: 10 }}>
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
        <FilterSection onBuscar={handleBuscar} />

        {/* Consolidated Analysis Metrics */}
        <ConsolidatedMetrics />

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
