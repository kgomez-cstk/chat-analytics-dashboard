import React from 'react';
import { Box, Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const LoadingDashboard: React.FC = () => {
  return (
    <Flex
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
      bg="brand.background"
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6}>
          <Spinner
            thickness="4px"
            speed="0.8s"
            emptyColor="brand.surfaceContainer"
            color="brand.primary"
            size="xl"
          />
          <Text
            fontFamily="heading"
            fontSize="lg"
            fontWeight="bold"
            color="brand.onSurface"
          >
            Cargando Dashboard...
          </Text>
          <Text fontSize="sm" color="brand.onSurfaceVariant">
            Esperando datos de configuración
          </Text>
        </VStack>
      </MotionBox>
    </Flex>
  );
};

export default LoadingDashboard;
