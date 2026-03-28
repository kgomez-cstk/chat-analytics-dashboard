import React from 'react';
import {
  Box,
  Flex,
  Button,
  Icon,
  Text,
  useBreakpointValue,
  Stack,
  VStack,
  SimpleGrid,
  Input,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import type { MultiValue } from 'chakra-react-select';
import { MdCalendarToday, MdFilterAlt, MdFlag, MdSearch, MdDownload, MdFilterAltOff } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import {
  setCanal,
  setSkills,
  setTipoUsuario,
  setRedSocial,
  setFechaInicio,
  setFechaFin,
  resetFilters,
} from './filtersSlice';
import {
  canalOptions,
  skillOptions,
  tipoUsuarioOptions,
  redSocialOptions,
} from '../../utils/mockData';
import { exportAdvisorsToExcel } from '../reports/exportExcel';
import { exportAdvisorsToPdf } from '../reports/exportPdf';
import type { FilterOption } from '../../types';

const FilterSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const advisors = useAppSelector((state) => state.dashboard.advisors);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const customNoOptionsMessage = () => 'Sin opciones disponibles';
  const handleExport = () => {
    // Multi-export for demonstration
    exportAdvisorsToExcel(advisors);
    exportAdvisorsToPdf(advisors);
  };

  return (
    <Box
      bg="brand.surfaceContainerLow"
      p={4}
      rounded="xl"
      shadow="sm"
    >
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={6}
        align={{ base: 'stretch', lg: 'center' }}
      >
        {/* Left Section: Filters */}
        <Box flex="1" maxH="300px" overflowY="auto" pr={2}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {/* Canal - Single Select */}
            <Box minW="150px">
              <Select
                isMulti
                instanceId="canal-select"
                noOptionsMessage={customNoOptionsMessage}
                placeholder="Canal"
                options={canalOptions}
                value={filters.canal}
                onChange={(val) => dispatch(setCanal(val as FilterOption[]))}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                chakraStyles={{
                  control: (provided) => ({
                    ...provided,
                    bg: 'brand.surfaceContainerLowest',
                    rounded: 'lg',
                    border: '1px solid',
                    borderColor: 'brand.outlineVariant',
                  }),
                }}
              />
            </Box>

            {/* Skill / Equipo - Multi Select */}
            <Box minW="150px">
              <Select
                instanceId="skill-select"
                noOptionsMessage={customNoOptionsMessage}
                placeholder="Skill / Equipo"
                options={skillOptions}
                value={filters.skills}
                onChange={(val) => dispatch(setSkills(val as FilterOption[]))}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                chakraStyles={{
                  control: (provided) => ({
                    ...provided,
                    bg: 'brand.surfaceContainerLowest',
                    rounded: 'lg',
                    border: '1px solid',
                    borderColor: 'brand.outlineVariant',
                  }),
                }}
              />
            </Box>

            {/* Red Social - Multi Select (Default WhatsApp) */}
            <Box minW="150px">
              <Select
                instanceId="red-social-select"
                noOptionsMessage={customNoOptionsMessage}
                placeholder="Red Social"
                options={redSocialOptions}
                value={filters.redSocial}
                onChange={(val) => dispatch(setRedSocial(val as FilterOption[]))}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                chakraStyles={{
                  control: (provided) => ({
                    ...provided,
                    bg: 'brand.surfaceContainerLowest',
                    rounded: 'lg',
                    border: '1px solid',
                    borderColor: 'brand.outlineVariant',
                  }),
                }}
              />
            </Box>

            {/* Date Filter */}
            <Flex
              align="center"
              gap={2}
              bg="brand.surfaceContainerLowest"
              px={3}
              py={2}
              rounded="lg"
              border="1px solid"
              borderColor="brand.outlineVariant"
              shadow="sm"
              minW="150px"
              h="42px"
              alignSelf="center"
            >
              <Icon as={MdCalendarToday} color="brand.primary" fontSize="lg" />
              <Input
                type={filters.dateMode === 'datetime' ? 'datetime-local' : 'date'}
                value={filters.dateMode === 'datetime' ? filters.fechaInicio : filters.fechaInicio.split('T')[0]}
                onChange={(e) => dispatch(setFechaInicio(e.target.value))}
                variant="unstyled"
                fontSize="sm"
                fontWeight="medium"
                size="sm"
              />
              <Text fontSize="xs" color="brand.onSurfaceVariant">al</Text>
              <Input
                type={filters.dateMode === 'datetime' ? 'datetime-local' : 'date'}
                value={filters.dateMode === 'datetime' ? filters.fechaFin : filters.fechaFin.split('T')[0]}
                onChange={(e) => dispatch(setFechaFin(e.target.value))}
                variant="unstyled"
                fontSize="sm"
                fontWeight="medium"
                size="sm"
              />
            </Flex>
          </SimpleGrid>
        </Box>

        {/* Right Section: Buttons */}
        <VStack spacing={2} minW={{ lg: '150px' }} align="stretch" justify="center">
          <Button
            variant="outline"
            borderColor="brand.primary"
            color="brand.primary"
            _hover={{ bg: 'brand.primaryContainer' }}
            leftIcon={<Icon as={MdSearch} />}
            shadow="md"
            w="full"
          >
            Buscar
          </Button>
          <Button
            variant="outline"
            borderColor="brand.primary"
            color="brand.primary"
            _hover={{ bg: 'brand.primaryContainer' }}
            shadow="md"
            leftIcon={<Icon as={MdFilterAltOff} />}
            fontWeight="bold"
            onClick={() => dispatch(resetFilters())}
            w="full"
          >
            Limpiar Filtros
          </Button>
          <Button
            variant="outline"
            leftIcon={<Icon as={MdDownload} />}
            borderColor="brand.primary"
            shadow="md"
            color="brand.primary"
            _hover={{ bg: 'brand.primaryContainer' }}
            onClick={handleExport}
            w="full"
          >
            Exportar
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
};

export default FilterSection;
/*Agregar Filtros
Gestion
Operador que inicia
Operador que finaliza

Nueva tabla intermedia

Primer agrupador canal
segundo skill
Tercero operador

Cantidad conversaciones unicas
promedio tiempo en cola
Promedio de TME
Promedio de Tmo
Promedio de Tma
promedio de tmr*/