import React from 'react';
import {
  SimpleGrid,
  Box,
  Text,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MdAccessTime, MdTimer, MdSpeed } from 'react-icons/md';
import { useAppSelector } from '../../hooks/useRedux';
import type { SLAMetric } from '../../types';

const MotionBox = motion.create(Box);

const timeToSeconds = (time: string) => {
  if (!time) return 0;
  const parts = time.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
};

const secondsToTime = (totalSec: number) => {
  if (isNaN(totalSec) || !totalSec) return '00:00:00';
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const TiemposMetricCards: React.FC = () => {
  const tiemposAtencion = useAppSelector((state) => state.dashboard.tiemposAtencion);

  const averages = React.useMemo(() => {
    if (!tiemposAtencion || tiemposAtencion.length === 0) {
      return { tma: '00:00:00', tmo: '00:00:00', tmr: '00:00:00' };
    }

    const sums = tiemposAtencion.reduce(
      (acc, curr) => ({
        tma: acc.tma + timeToSeconds(curr.tma),
        tmo: acc.tmo + timeToSeconds(curr.tmo),
        tmr: acc.tmr + timeToSeconds(curr.tmr),
      }),
      { tma: 0, tmo: 0, tmr: 0 }
    );

    const len = tiemposAtencion.length;
    return {
      tma: secondsToTime(sums.tma / len),
      tmo: secondsToTime(sums.tmo / len),
      tmr: secondsToTime(sums.tmr / len),
    };
  }, [tiemposAtencion]);

  const metrics: SLAMetric[] = [
    {
      label: 'Promedio Global TMA',
      value: averages.tma,
      trend: 0,
      trendLabel: '',
      trendDirection: 'neutral',
      borderColor: 'brand.primary',
      icon: 'access_time',
    },
    {
      label: 'Promedio Global TMO',
      value: averages.tmo,
      trend: 0,
      trendLabel: '',
      trendDirection: 'neutral',
      borderColor: 'brand.secondary',
      icon: 'speed',
    },
    {
      label: 'Promedio Global TMR',
      value: averages.tmr,
      trend: 0,
      trendLabel: '',
      trendDirection: 'neutral',
      borderColor: 'brand.tertiary',
      icon: 'timer',
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
      {metrics.map((metric, index) => (
        <MotionBox
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          bg="brand.surfaceContainerLowest"
          p={6}
          rounded="xl"
          borderLeft="4px solid"
          borderColor={metric.borderColor}
          shadow="sm"
          position="relative"
          overflow="hidden"
          role="group"
        >
          {/* Background Icon Decoration */}
          <Box
            position="absolute"
            top={0}
            right={0}
            p={4}
            opacity={0.05}
            _groupHover={{ opacity: 0.1 }}
            transition="opacity 0.2s"
          >
            <Icon
              as={
                metric.icon === 'access_time'
                  ? MdAccessTime
                  : metric.icon === 'speed'
                    ? MdSpeed
                    : MdTimer
              }
              fontSize="6xl"
            />
          </Box>
          <Text
            fontSize="xs"
            fontWeight="medium"
            color="brand.onSurfaceVariant"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            {metric.label}
          </Text>
          <Text
            fontFamily="heading"
            fontSize="4xl"
            fontWeight="bold"
            mt={2}
          >
            {metric.value}
          </Text>
        </MotionBox>
      ))}
    </SimpleGrid>
  );
};

export default TiemposMetricCards;
