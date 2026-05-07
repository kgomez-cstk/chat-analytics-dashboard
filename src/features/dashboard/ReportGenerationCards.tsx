import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useAppSelector } from '../../hooks/useRedux';
import { exportToXLSX, exportToCSV } from '../../utils/exporters';

interface ReportGenerationCardsProps {
  onPreview: (type: 'conversaciones' | 'tiempos' | null) => void;
  activeReport: 'conversaciones' | 'tiempos' | null;
}

const ReportGenerationCards: React.FC<ReportGenerationCardsProps> = ({ onPreview, activeReport }) => {
  const advisors = useAppSelector((state) => state.dashboard.advisors);
  const tiempos = useAppSelector((state) => state.dashboard.tiemposAtencion);
  const toast = useToast();

  const handlePreview = (type: 'conversaciones' | 'tiempos') => {
    if (activeReport === type) {
      onPreview(null);
    } else {
      onPreview(type);
    }
  };

  const handleDownload = (type: 'conversaciones' | 'tiempos', format: 'xlsx' | 'csv') => {
    if (type === 'conversaciones') {
      const columns = [
        { accessorKey: 'nombre', header: 'Nombre' },
        { accessorKey: 'clientesUnicos', header: 'Clientes Únicos' },
        { accessorKey: 'conversacionesAtendidasCerradas', header: 'Conversaciones Atendidas Cerradas' },
        { accessorKey: 'conversacionesTotales', header: 'Conversaciones Totales' },
        { accessorKey: 'conversacionesConRespuesta', header: 'Conversaciones Con Respuesta' },
        { accessorKey: 'abandonoAsesor', header: 'Abandono Asesor' },
        { accessorKey: 'porcentajeAbandono', header: '% Abandono' },
        { accessorKey: 'conversacionesMenores3Min', header: 'Conversaciones < 3 Min' },
        { accessorKey: 'porcentajeMenores3Min', header: '% Menores 3 Min' },
        { accessorKey: 'tiempoEnLinea', header: 'Tiempo En Línea' },
        { accessorKey: 'promedioDiarioLinea', header: 'Promedio Diario Línea' },
        { accessorKey: 'tiempoEnPausa', header: 'Tiempo En Pausa' },
        { accessorKey: 'promedioDiarioPausa', header: 'Promedio Diario Pausa' },
      ];
      if (format === 'xlsx') exportToXLSX(advisors, columns, 'Reporte_Conversaciones', toast);
      else exportToCSV(advisors, columns, 'Reporte_Conversaciones', toast);
    } else {
      const columns = [
        { accessorKey: 'nombre', header: 'Nombre' },
        { accessorKey: 'clientesUnicos', header: 'Clientes Únicos' },
        { accessorKey: 'cantidadConversaciones', header: 'Cantidad Conversaciones' },
        { accessorKey: 'abandonoAsesor', header: 'Abandono Asesor' },
        { accessorKey: 'porcentajeAbandono', header: '% Abandono' },
        { accessorKey: 'tiempoEnCola', header: 'Tiempo En Cola' },
        { accessorKey: 'tma', header: 'TMA' },
        { accessorKey: 'tmeOperador', header: 'TME Operador' },
        { accessorKey: 'tmo', header: 'TMO' },
        { accessorKey: 'tmr', header: 'TMR' },
      ];
      if (format === 'xlsx') exportToXLSX(tiempos, columns, 'Reporte_Tiempos_Atencion', toast);
      else exportToCSV(tiempos, columns, 'Reporte_Tiempos_Atencion', toast);
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
            <Flex gap={2}>
              <Button
                flex={1}
                py={6}
                bg="gray.100"
                color="gray.700"
                _hover={{ bg: 'brand.primary', color: 'white' }}
                fontWeight="bold"
                rounded="lg"
                transition="all 0.2s"
                leftIcon={<Box as="span" className="material-symbols-outlined">download</Box>}
                onClick={() => handleDownload('tiempos', 'xlsx')}
              >
                Excel
              </Button>
              <Button
                flex={1}
                py={6}
                bg="gray.100"
                color="gray.700"
                _hover={{ bg: 'brand.primary', color: 'white' }}
                fontWeight="bold"
                rounded="lg"
                transition="all 0.2s"
                leftIcon={<Box as="span" className="material-symbols-outlined">download</Box>}
                onClick={() => handleDownload('tiempos', 'csv')}
              >
                CSV
              </Button>
            </Flex>
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
            <Flex gap={2}>
              <Button
                flex={1}
                py={6}
                bg="gray.100"
                color="gray.700"
                _hover={{ bg: 'brand.primary', color: 'white' }}
                fontWeight="bold"
                rounded="lg"
                transition="all 0.2s"
                leftIcon={<Box as="span" className="material-symbols-outlined">download</Box>}
                onClick={() => handleDownload('conversaciones', 'xlsx')}
              >
                Excel
              </Button>
              <Button
                flex={1}
                py={6}
                bg="gray.100"
                color="gray.700"
                _hover={{ bg: 'brand.primary', color: 'white' }}
                fontWeight="bold"
                rounded="lg"
                transition="all 0.2s"
                leftIcon={<Box as="span" className="material-symbols-outlined">download</Box>}
                onClick={() => handleDownload('conversaciones', 'csv')}
              >
                CSV
              </Button>
            </Flex>
          </Flex>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default ReportGenerationCards;
