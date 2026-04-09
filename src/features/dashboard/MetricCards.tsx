import React from 'react';
import {
  SimpleGrid,
  Box,
  Text,
  Flex,
  Icon,
  useTheme,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MdChatBubble, MdPersonSearch, MdSpeed, MdTrendingUp, MdTrendingDown, MdInfo } from 'react-icons/md';
import { useAppSelector } from '../../hooks/useRedux';
import type { SLAMetric } from '../../types';

const MotionBox = motion.create(Box);

const MetricCards: React.FC = () => {
  const advisors = useAppSelector((state) => state.dashboard.advisors);
  const tiemposAtencion = useAppSelector((state) => state.dashboard.tiemposAtencion);

  const totals = React.useMemo(() => {
    const counts = advisors.reduce(
      (acc, curr) => ({
        totales: acc.totales + curr.conversacionesTotales,
        conRespuesta: acc.conRespuesta + curr.conversacionesConRespuesta,
        abandono: acc.abandono + curr.abandonoAsesor,
        clientes: acc.clientes + curr.clientesUnicos,
      }),
      { totales: 0, conRespuesta: 0, abandono: 0, clientes: 0 }
    );

    const formatPercentage = (num: number, den: number) => 
      den > 0 ? ((num / den) * 100).toFixed(1) + '%' : '0.0%';

    // Calculate average Tiempo en Cola from TiemposAtencionPage types
    // We assume the values are already in HH:MM:SS format
    const timeToSeconds = (timeStr: string): number => {
      if (!timeStr) return 0;
      const parts = timeStr.split(':').map(Number);
      return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : 0;
    };

    const secondsToTime = (totalSeconds: number): string => {
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const totalSecondsCola = tiemposAtencion.reduce((sum, row) => sum + timeToSeconds(row.tiempoEnCola), 0);
    const avgSecondsCola = tiemposAtencion.length > 0 ? Math.floor(totalSecondsCola / tiemposAtencion.length) : 0;

    return {
      totales: counts.totales.toLocaleString(),
      conRespuesta: counts.conRespuesta.toLocaleString(),
      abandono: counts.abandono.toLocaleString(),
      porcentajeAbandono: formatPercentage(counts.abandono, counts.totales),
      clientes: counts.clientes.toLocaleString(),
      tiempoEnCola: secondsToTime(avgSecondsCola),
    };
  }, [advisors, tiemposAtencion]);

  const metrics: SLAMetric[] = [
    {
      label: 'Total de conversaciones',
      value: totals.totales,
      trend: 0,
      trendLabel: '',
      trendDirection: 'neutral',
      borderColor: 'brand.primary',
      icon: 'chat_bubble',
    },
    {
      label: 'Conversaciones con respuesta del asesor',
      value: totals.conRespuesta,
      trend: 0,
      trendLabel: '',
      trendDirection: 'neutral',
      borderColor: 'brand.secondary',
      icon: 'chat_bubble',
    },
    {
      label: 'Abandono asesor',
      value: totals.abandono,
      trend: 0,
      trendLabel: '',
      trendDirection: 'neutral',
      borderColor: 'brand.error',
      icon: 'chat_bubble',
    },
    {
      label: '% de abandono asesor',
      value: totals.porcentajeAbandono,
      trend: 0,
      trendLabel: '',
      trendDirection: 'neutral',
      borderColor: 'brand.error',
      icon: 'speed',
    },
    {
      label: 'Clientes únicos',
      value: totals.clientes,
      trend: 0,
      trendLabel: '',
      trendDirection: 'neutral',
      borderColor: 'brand.tertiary',
      icon: 'person_search',
    },
    {
      label: 'Tiempo en cola',
      value: totals.tiempoEnCola,
      trend: 0,
      trendLabel: '',
      trendDirection: 'neutral',
      borderColor: 'brand.primaryDim',
      icon: 'speed',
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={5}>
      {metrics.map((metric, index) => (
        <MotionBox
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          bg="brand.surfaceContainerLowest"
          py={3}
          px={5}
          rounded="xl"
          borderLeft="4px solid"
          borderColor={metric.borderColor}
          shadow="sm"
          position="relative"
          overflow="hidden"
          role="group"
          h="auto"
          minH="90px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {/* Background Icon Decoration */}
          <Box
            position="absolute"
            top={0}
            right={0}
            p={2}
            opacity={0.03}
            _groupHover={{ opacity: 0.08 }}
            transition="opacity 0.2s"
          >
            <Icon
              as={
                metric.icon === 'chat_bubble'
                  ? MdChatBubble
                  : metric.icon === 'person_search'
                    ? MdPersonSearch
                    : MdSpeed
              }
              fontSize="4xl"
            />
          </Box>
          <Text
            fontSize="10px"
            fontWeight="bold"
            color="brand.onSurfaceVariant"
            textTransform="uppercase"
            letterSpacing="wider"
            lineHeight="shorter"
            mb={1}
          >
            {metric.label}
          </Text>
          <Text
            fontFamily="heading"
            fontSize="2xl"
            fontWeight="bold"
            color="brand.onSurface"
          >
            {metric.value}
          </Text>
        </MotionBox>
      ))}
    </SimpleGrid>
  );
};

export default MetricCards;
