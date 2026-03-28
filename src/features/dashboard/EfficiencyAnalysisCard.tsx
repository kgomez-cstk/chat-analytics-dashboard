import React from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  Button,
} from '@chakra-ui/react';
import { MdArrowForward } from 'react-icons/md';
import { motion } from 'framer-motion';

const MotionCircle = motion.create('circle');

const EfficiencyAnalysisCard: React.FC = () => {
  const kpiValue = 68; // Percent
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (kpiValue / 100) * circumference;

  return (
    <Box
      bg="brand.surfaceContainerLowest"
      p={6}
      rounded="xl"
      shadow="sm"
      border="1px solid"
      borderColor="brand.outlineVariant"
      display="flex"
      alignItems="center"
      gap={6}
    >
      <Box flex={1}>
        <Text fontFamily="heading" fontWeight="bold" color="brand.onSurface" mb={2}>
          Análisis de Eficiencia
        </Text>
        <Text fontSize="sm" color="brand.onSurfaceVariant" mb={4}>
          El equipo presenta una mejora del 5% en tiempos de respuesta durante la última semana, aunque la tasa de cierre disminuyó.
        </Text>
        <Button
          variant="link"
          color="brand.primary"
          fontSize="sm"
          fontWeight="bold"
          rightIcon={<Icon as={MdArrowForward} />}
          _hover={{ textDecoration: 'underline' }}
        >
          Ver detalles profundos
        </Button>
      </Box>

      {/* SVG Circular Progress */}
      <Box w={32} h={32} position="relative" flexShrink={0}>
        <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="var(--chakra-colors-brand-surfaceContainer)"
            strokeWidth="8"
          />
          <MotionCircle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="var(--chakra-colors-brand-primary)"
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <Flex
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          direction="column"
          align="center"
          justify="center"
        >
          <Text fontSize="xl" fontWeight="bold">
            {kpiValue}%
          </Text>
          <Text
            fontSize="9px"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="widest"
            color="brand.onSurfaceVariant"
          >
            KPI
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default EfficiencyAnalysisCard;
