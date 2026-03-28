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

  const totals = React.useMemo(() => {
    const counts = advisors.reduce(
      (acc, curr) => ({
        totales: acc.totales + curr.conversacionesTotales,
        unicas: acc.unicas + curr.conversacionesMenores3Min,
      }),
      { totales: 0, unicas: 0 }
    );

    const performance = counts.totales > 0
      ? (counts.unicas / counts.totales) * 100
      : 0;

    return {
      totales: counts.totales.toLocaleString(),
      unicas: counts.unicas.toLocaleString(),
      performance: performance.toFixed(1) + '%',
    };
  }, [advisors]);

  const metrics: SLAMetric[] = [
    {
      label: 'Total Conversaciones',
      value: totals.totales,
      trend: 0,
      trendLabel: '',
      trendDirection: 'neutral',
      borderColor: 'brand.primary',
      icon: 'chat_bubble',
    },
    {
      label: 'Total Conversaciones Únicas',
      value: totals.unicas,
      trend: 0,
      trendLabel: '',
      trendDirection: 'neutral',
      borderColor: 'brand.secondary',
      icon: 'person_search',
    },
    {
      label: 'Promedio % Conv. Masivas o Vinculadas',
      value: totals.performance,
      trend: 0,
      trendLabel: '',
      trendDirection: 'neutral',
      borderColor: 'brand.error',
      icon: 'speed',
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
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
                metric.icon === 'chat_bubble'
                  ? MdChatBubble
                  : metric.icon === 'person_search'
                    ? MdPersonSearch
                    : MdSpeed
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

export default MetricCards;
