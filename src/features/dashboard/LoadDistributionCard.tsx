import React from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  SimpleGrid,
  Tooltip,
} from '@chakra-ui/react';
import { MdMoreHoriz } from 'react-icons/md';
import { useAppSelector } from '../../hooks/useRedux';

const LoadDistributionCard: React.FC = () => {
  const loadDistribution = useAppSelector((state) => state.dashboard.loadDistribution);

  return (
    <Box
      bg="brand.surfaceContainerLowest"
      p={6}
      rounded="xl"
      shadow="sm"
      border="1px solid"
      borderColor="brand.outlineVariant"
    >
      <Flex align="center" justify="space-between" mb={6}>
        <Text fontFamily="heading" fontWeight="bold" color="brand.onSurface">
          Distribución de Carga
        </Text>
        <Icon as={MdMoreHoriz} color="brand.onSurfaceVariant" />
      </Flex>

      {/* Stacked Horizontal Bar */}
      <Flex
        h={4}
        w="full"
        bg="brand.surfaceContainer"
        rounded="full"
        overflow="hidden"
      >
        {loadDistribution.map((item, index) => (
          <Tooltip key={index} label={`${item.nombre}: ${item.porcentaje}%`}>
            <Box
              h="full"
              bg={item.color}
              w={`${item.porcentaje}%`}
              transition="width 0.5s ease-in-out"
            />
          </Tooltip>
        ))}
      </Flex>

      {/* Legend */}
      <SimpleGrid columns={2} spacing={2} mt={4}>
        {loadDistribution.map((item, index) => (
          <Flex key={index} align="center" gap={2}>
            <Box w={3} h={3} rounded="sm" bg={item.color} />
            <Text fontSize="xs" color="brand.onSurfaceVariant">
              {item.shortName}
            </Text>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default LoadDistributionCard;
