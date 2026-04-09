import React, { useEffect, memo } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setTiemposAtencion, setLoading } from './dashboardSlice';
import { mockTiemposAtencion } from '../../utils/mockData';
import FilterSection from '../filters/FilterSection';
import TiemposAtencionTable from './TiemposAtencionTable';
import LoadingDashboard from '../../components/LoadingDashboard';

const TiemposAtencionPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.dashboard.isLoading);

  useEffect(() => {
    dispatch(setLoading(true));
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      dispatch(setTiemposAtencion(mockTiemposAtencion));
      dispatch(setLoading(false));
    }, 800);

    return () => clearTimeout(timer);
  }, [dispatch, mockTiemposAtencion]);

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
            Tiempos de Atención
          </Heading>
          <Text color="brand.onSurfaceVariant" mt={1}>
            Reporte que muestra los tiempos promedio de atención, espera, operación y respuesta de cada Asesor de Venta Online (AVO).
          </Text>
        </Box>

        {/* Filters */}
        <FilterSection />

        {/* Report Content */}
        <TiemposAtencionTable />
      </VStack>
    </Container>
  );
};

export default memo(TiemposAtencionPage);
