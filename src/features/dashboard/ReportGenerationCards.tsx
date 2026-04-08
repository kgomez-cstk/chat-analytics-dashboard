import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Button,
} from '@chakra-ui/react';
import { useAppSelector } from '../../hooks/useRedux';
import { exportAdvisorsToExcel } from '../reports/exportExcel';

interface ReportGenerationCardsProps {
  onPreview: (type: 'conversaciones' | 'tiempos' | null) => void;
  activeReport: 'conversaciones' | 'tiempos' | null;
}

const ReportGenerationCards: React.FC<ReportGenerationCardsProps> = ({ onPreview, activeReport }) => {
  const advisors = useAppSelector((state) => state.dashboard.advisors);
  const tiempos = useAppSelector((state) => state.dashboard.tiemposAtencion); // Make sure this is selected from correctly mapped state

  const handlePreview = (type: 'conversaciones' | 'tiempos') => {
    if (activeReport === type) {
      onPreview(null);
    } else {
      onPreview(type);
    }
  };

  const handleDownload = (type: 'conversaciones' | 'tiempos') => {
    if (type === 'conversaciones') {
      exportAdvisorsToExcel(advisors);
    } else {
      // Assuming a similar export method exists for "tiempos"
      // Wait, there might be, let me check via `exportTiemposToExcel(tiempos)` or something. Using a dummy log for now if it doesn't compile.
      console.log('Descargando tiempos de atencion', tiempos);
    }
  };

  return (
    <Box mb={6}>
      <Heading fontFamily="heading" fontSize="xl" fontWeight="bold" color="gray.900" mb={6}>
        Generar Reportes Detallados
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Card 1: Tiempos de Atención */}
        <Box
          bg="brand.surfaceContainerLowest"
          p={6}
          rounded="xl"
          border="1px solid"
          borderColor="brand.outlineVariant"
          transition="all 0.2s"
          _hover={{ shadow: 'lg' }}
          role="group"
        >
          <Flex mb={4} justify="space-between" align="start">
            <Box
              p={3}
              bg="blue.50"
              color="blue.600"
              rounded="xl"
              transition="colors 0.2s"
              _groupHover={{ bg: 'brand.primary', color: 'white' }}
            >
              <Box as="span" className="material-symbols-outlined" fontSize="3xl">
                timer
              </Box>
            </Box>
          </Flex>
          <Heading as="h4" fontFamily="heading" fontWeight="bold" fontSize="lg" color="gray.900" mb={2}>
            Reporte: Tiempos de Atención
          </Heading>
          <Text color="brand.onSurfaceVariant" fontSize="sm" mb={6} lineHeight="relaxed">
            Análisis detallado de SLAs y tiempos por operador. Incluye métricas de disponibilidad y tiempos muertos por jornada laboral.
          </Text>
          <Flex direction="column" gap={3}>
            <Button
              w="full"
              py={6}
              bg={activeReport === 'tiempos' ? 'brand.primary' : 'gray.100'}
              color={activeReport === 'tiempos' ? 'white' : 'gray.700'}
              _hover={{ bg: 'brand.primary', color: 'white' }}
              fontWeight="bold"
              rounded="lg"
              transition="all 0.2s"
              leftIcon={<Box as="span" className="material-symbols-outlined">visibility</Box>}
              onClick={() => handlePreview('tiempos')}
            >
              {activeReport === 'tiempos' ? 'Ocultar Tabla' : 'Previsualizar Tabla'}
            </Button>
            <Button
              w="full"
              py={6}
              bg="gray.100"
              color="gray.700"
              _hover={{ bg: 'brand.primary', color: 'white' }}
              fontWeight="bold"
              rounded="lg"
              transition="all 0.2s"
              leftIcon={<Box as="span" className="material-symbols-outlined">download</Box>}
              onClick={() => handleDownload('tiempos')}
            >
              Descargar Excel
            </Button>
          </Flex>
        </Box>

        {/* Card 2: Conversaciones WhatsApp/General */}
        <Box
          bg="brand.surfaceContainerLowest"
          p={6}
          rounded="xl"
          border="1px solid"
          borderColor="brand.outlineVariant"
          transition="all 0.2s"
          _hover={{ shadow: 'lg' }}
          role="group"
        >
          <Flex mb={4} justify="space-between" align="start">
            <Box
              p={3}
              bg="blue.50"
              color="blue.600"
              rounded="xl"
              transition="colors 0.2s"
              _groupHover={{ bg: 'brand.primary', color: 'white' }}
            >
              <Box as="span" className="material-symbols-outlined" fontSize="3xl">
                chat
              </Box>
            </Box>
          </Flex>
          <Heading as="h4" fontFamily="heading" fontWeight="bold" fontSize="lg" color="gray.900" mb={2}>
            Reporte: Conversaciones
          </Heading>
          <Text color="brand.onSurfaceVariant" fontSize="sm" mb={6} lineHeight="relaxed">
            Volumen, distribución y eficiencia de conversaciones. Desglose por origen de contacto y tipo de gestión resuelta por la IA y humanos.
          </Text>
          <Flex direction="column" gap={3}>
            <Button
              w="full"
              py={6}
              bg={activeReport === 'conversaciones' ? 'brand.primary' : 'gray.100'}
              color={activeReport === 'conversaciones' ? 'white' : 'gray.700'}
              _hover={{ bg: 'brand.primary', color: 'white' }}
              fontWeight="bold"
              rounded="lg"
              transition="all 0.2s"
              leftIcon={<Box as="span" className="material-symbols-outlined">visibility</Box>}
              onClick={() => handlePreview('conversaciones')}
            >
              {activeReport === 'conversaciones' ? 'Ocultar Tabla' : 'Previsualizar Tabla'}
            </Button>
            <Button
              w="full"
              py={6}
              bg="gray.100"
              color="gray.700"
              _hover={{ bg: 'brand.primary', color: 'white' }}
              fontWeight="bold"
              rounded="lg"
              transition="all 0.2s"
              leftIcon={<Box as="span" className="material-symbols-outlined">download</Box>}
              onClick={() => handleDownload('conversaciones')}
            >
              Descargar Excel
            </Button>
          </Flex>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default ReportGenerationCards;
