import React from 'react';
import {
  Box,
  Flex,
  Button,
  Icon,
  Text,
  useBreakpointValue,
  VStack,
  SimpleGrid,
  Input,
  Badge,
} from '@chakra-ui/react';
import { Select, chakraComponents, type GroupBase, type ValueContainerProps } from 'chakra-react-select';
import { MdCalendarToday, MdSearch, MdFilterAltOff } from 'react-icons/md';
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
  setQueryMode,
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

// Custom component to show a summary of selected items when the select is closed
const CustomValueContainer = (props: ValueContainerProps<FilterOption, true, GroupBase<FilterOption>>) => {
  const { children, getValue } = props;
  const getValueResponse = getValue();
  const count = getValueResponse.length;
  const isMenuOpen = props.selectProps.menuIsOpen;

  if (count > 0 && !isMenuOpen) {
    const label = count === 1 ? getValueResponse[0].label : `${count} seleccionados`;
    return (
      <chakraComponents.ValueContainer {...props}>
        <Badge
          colorScheme="gray"
          variant="subtle"
          px={2}
          py={0.5}
          rounded="full"
          fontSize="xs"
          fontWeight="bold"
          textTransform="none"
          color="gray.800"
          bg="gray.100"
          maxW="140px"
        >
          <Text isTruncated>{label}</Text>
        </Badge>
        {/* We keep other children like the input (for searchability) but filter out multi-values */}
        {React.Children.map(children, (child) => {
          if (child && (child as any).type === chakraComponents.MultiValue) return null;
          return child;
        })}
      </chakraComponents.ValueContainer>
    );
  }

  return <chakraComponents.ValueContainer {...props}>{children}</chakraComponents.ValueContainer>;
};

const FilterSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const customNoOptionsMessage = () => 'Sin opciones disponibles';

  const commonComponents = {
    ValueContainer: CustomValueContainer,
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
        <Box flex="1" maxH="325px" overflowY="auto" pr={2} sx={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'brand.outlineVariant',
            borderRadius: '24px',
          },
        }}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacingX={4} spacingY={3}>
            {/* Canal */}
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" ml={1}>Canal</Text>
              <Box w="full">
                <Select
                  isMulti
                  components={commonComponents}
                  instanceId="canal-select"
                  noOptionsMessage={customNoOptionsMessage}
                  placeholder="Seleccionar..."
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
                      minH: '40px',
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      gap: '4px',
                    }),
                  }}
                />
              </Box>
            </VStack>

            {/* Skill / Equipo */}
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" ml={1}>Skill / Equipo</Text>
              <Box w="full">
                <Select
                  isMulti
                  components={commonComponents}
                  instanceId="skill-select"
                  noOptionsMessage={customNoOptionsMessage}
                  placeholder="Seleccionar..."
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
                      minH: '40px',
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      gap: '4px',
                    }),
                  }}
                />
              </Box>
            </VStack>

            {/* Red Social */}
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" ml={1}>Red Social</Text>
              <Box w="full">
                <Select
                  isMulti
                  components={commonComponents}
                  instanceId="red-social-select"
                  noOptionsMessage={customNoOptionsMessage}
                  placeholder="Seleccionar..."
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
                      minH: '40px',
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      gap: '4px',
                    }),
                  }}
                />
              </Box>
            </VStack>

            {/* Tipo Usuario */}
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" ml={1}>Tipo de Usuario</Text>
              <Box w="full">
                <Select
                  isMulti
                  components={commonComponents}
                  instanceId="tipo-usuario-select"
                  noOptionsMessage={customNoOptionsMessage}
                  placeholder="Seleccionar..."
                  options={tipoUsuarioOptions}
                  value={filters.tipoUsuario}
                  onChange={(val) => dispatch(setTipoUsuario(val as unknown as FilterOption[]))}
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  chakraStyles={{
                    control: (provided) => ({
                      ...provided,
                      bg: 'brand.surfaceContainerLowest',
                      rounded: 'lg',
                      border: '1px solid',
                      borderColor: 'brand.outlineVariant',
                      minH: '40px',
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      gap: '4px',
                    }),
                  }}
                />
              </Box>
            </VStack>

            {/* Gestiones */}
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" ml={1}>Gestiones</Text>
              <Box w="full">
                <Select
                  isMulti
                  components={commonComponents}
                  instanceId="gestiones-select"
                  noOptionsMessage={customNoOptionsMessage}
                  placeholder="Seleccionar..."
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
                      minH: '40px',
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      gap: '4px',
                    }),
                  }}
                />
              </Box>
            </VStack>

            {/* Usuario que inicia */}
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" ml={1}>Usuario que inicia</Text>
              <Box w="full">
                <Select
                  isMulti
                  components={commonComponents}
                  instanceId="usuario-inicia-select"
                  noOptionsMessage={customNoOptionsMessage}
                  placeholder="Seleccionar..."
                  options={usuarioIniciaOptions}
                  value={filters.usuarioInicia}
                  onChange={(val) => dispatch(setUsuarioInicia(val as unknown as FilterOption[]))}
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  chakraStyles={{
                    control: (provided) => ({
                      ...provided,
                      bg: 'brand.surfaceContainerLowest',
                      rounded: 'lg',
                      border: '1px solid',
                      borderColor: 'brand.outlineVariant',
                      minH: '40px',
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      gap: '4px',
                    }),
                  }}
                />
              </Box>
            </VStack>

            {/* Usuario que finaliza */}
            <VStack align="start" spacing={1} pt={{ lg: 1.5 }}>
              <Text fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" ml={1} mb="7px">Usuario que finaliza</Text>
              <Box w="full">
                <Select
                  isMulti
                  components={commonComponents}
                  instanceId="usuario-finaliza-select"
                  noOptionsMessage={customNoOptionsMessage}
                  placeholder="Seleccionar..."
                  options={usuarioFinalizaOptions}
                  value={filters.usuarioFinaliza}
                  onChange={(val) => dispatch(setUsuarioFinaliza(val as unknown as FilterOption[]))}
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  chakraStyles={{
                    control: (provided) => ({
                      ...provided,
                      bg: 'brand.surfaceContainerLowest',
                      rounded: 'lg',
                      border: '1px solid',
                      borderColor: 'brand.outlineVariant',
                      minH: '40px',
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      gap: '4px',
                    }),
                  }}
                />
              </Box>
            </VStack>

            {/* Date Filter */}
            <VStack align="start" spacing={1}>
              <Flex justify="space-between" align="center" w="full" px={1}>
                <Text fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant">Temporalidad</Text>
                <Flex bg="brand.surfaceContainerLowest" p={1} rounded="md" border="1px solid" borderColor="brand.outlineVariant">
                  <Button
                    size="xs"
                    px={2}
                    variant={filters.queryMode === 'today' ? 'solid' : 'ghost'}
                    colorScheme={filters.queryMode === 'today' ? 'blue' : 'gray'}
                    onClick={() => dispatch(setQueryMode('today'))}
                    fontSize="9px"
                    h="20px"
                  >
                    Hoy
                  </Button>
                  <Button
                    size="xs"
                    px={2}
                    variant={filters.queryMode === 'range' ? 'solid' : 'ghost'}
                    colorScheme={filters.queryMode === 'range' ? 'blue' : 'gray'}
                    onClick={() => dispatch(setQueryMode('range'))}
                    fontSize="9px"
                    h="20px"
                  >
                    Rango
                  </Button>
                </Flex>
              </Flex>

              {filters.queryMode === 'today' ? (
                <Flex
                  align="center"
                  w="full"
                  h="40px"
                  bg="brand.surfaceContainerLowest"
                  px={4}
                  rounded="lg"
                  border="1px solid"
                  borderColor="brand.outlineVariant"
                  shadow="sm"
                >
                  <Icon as={MdCalendarToday} color="brand.primary" mr={2} />
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    Consultando Hoy: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </Text>
                </Flex>
              ) : (
                <Flex
                  align="center"
                  gap={2}
                  w="full"
                  h="40px"
                >
                  <Input
                    type="date"
                    value={filters.fechaInicio.split('T')[0]}
                    onChange={(e) => dispatch(setFechaInicio(e.target.value))}
                    max={new Date(Date.now() - 86400000).toISOString().split('T')[0]}
                    bg="brand.surfaceContainerLowest"
                    rounded="lg"
                    border="1px solid"
                    borderColor="brand.outlineVariant"
                    shadow="sm"
                    fontSize="xs"
                    fontWeight="medium"
                    size="md"
                    h="40px"
                  />
                  <Text fontSize="xs" color="brand.onSurfaceVariant">al</Text>
                  <Input
                    type="date"
                    value={filters.fechaFin.split('T')[0]}
                    onChange={(e) => dispatch(setFechaFin(e.target.value))}
                    max={new Date(Date.now() - 86400000).toISOString().split('T')[0]}
                    min={filters.fechaInicio.split('T')[0]}
                    bg="brand.surfaceContainerLowest"
                    rounded="lg"
                    border="1px solid"
                    borderColor="brand.outlineVariant"
                    shadow="sm"
                    fontSize="xs"
                    fontWeight="medium"
                    size="md"
                    h="40px"
                  />
                </Flex>
              )}
            </VStack>
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