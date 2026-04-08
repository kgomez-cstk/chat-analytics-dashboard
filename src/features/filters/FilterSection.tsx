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
import { MdCalendarToday, MdFilterAlt, MdFlag, MdSearch, MdFilterAltOff } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import {
  setCanal,
  setSkills,
  setTipoUsuario,
  setRedSocial,
  setGestiones,
  setUsuarioInicia,
  setUsuarioFinaliza,
  setFechaInicio,
  setFechaFin,
  resetFilters,
} from './filtersSlice';
import {
  canalOptions,
  skillOptions,
  tipoUsuarioOptions,
  redSocialOptions,
  gestionOptions,
  usuarioIniciaOptions,
  usuarioFinalizaOptions,
} from '../../utils/mockData';
import type { FilterOption } from '../../types';

const FilterSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const customNoOptionsMessage = () => 'Sin opciones disponibles';

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
        <Box flex="1" overflowY="auto" pr={2}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            {/* Canal - Single Select */}
            <Box minW="150px">
              <Select
                isMulti
                instanceId="canal-select"
                noOptionsMessage={customNoOptionsMessage}
                placeholder="Canal"
                options={canalOptions}
                value={filters.canal}
                onChange={(val) => dispatch(setCanal(val as unknown as FilterOption[]))}
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
                onChange={(val) => dispatch(setSkills(val as unknown as FilterOption[]))}
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
                onChange={(val) => dispatch(setRedSocial(val as unknown as FilterOption[]))}
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

            {/* Gestiones - Multi Select */}
            <Box minW="150px">
              <Select
                isMulti
                instanceId="gestiones-select"
                noOptionsMessage={customNoOptionsMessage}
                placeholder="Gestiones"
                options={gestionOptions}
                value={filters.gestiones}
                onChange={(val) => dispatch(setGestiones(val as unknown as FilterOption[]))}
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

            {/* Usuario Inicia - Single Select */}
            <Box minW="150px">
              <Select
                instanceId="usuario-inicia-select"
                noOptionsMessage={customNoOptionsMessage}
                placeholder="Usuario que inicia"
                options={usuarioIniciaOptions}
                value={filters.usuarioInicia}
                onChange={(val) => dispatch(setUsuarioInicia(val ? [val as FilterOption] : []))}
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

            {/* Usuario Finaliza - Single Select */}
            <Box minW="150px">
              <Select
                instanceId="usuario-finaliza-select"
                noOptionsMessage={customNoOptionsMessage}
                placeholder="Usuario que finaliza"
                options={usuarioFinalizaOptions}
                value={filters.usuarioFinaliza}
                onChange={(val) => dispatch(setUsuarioFinaliza(val ? [val as FilterOption] : []))}
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
        </VStack>
      </Flex>
    </Box>
  );
};

export default FilterSection;