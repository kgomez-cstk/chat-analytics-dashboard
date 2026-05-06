import React from 'react';
import {
  Box,
  Flex,
  Button,
  Icon,
  Text,
  VStack,
  SimpleGrid,
  Input,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import {
  Select,
  chakraComponents,
  type GroupBase,
  type ValueContainerProps,
} from 'chakra-react-select';
import { MdCalendarToday, MdSearch, MdFilterAltOff, MdCompareArrows } from 'react-icons/md';
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
  setPeriodoSource,
  resetFilters,
} from './filtersSlice';
import type { FilterOption } from '../../types';

// ─── Value container personalizado ───────────────────────────────────────────

const CustomValueContainer = (
  props: ValueContainerProps<FilterOption, true, GroupBase<FilterOption>>
) => {
  const { children, getValue } = props;
  const selected   = getValue();
  const count      = selected.length;
  const isMenuOpen = props.selectProps.menuIsOpen;

  if (count > 0 && !isMenuOpen) {
    const label = count === 1 ? selected[0].label : `${count} seleccionados`;
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
        {React.Children.map(children, (child) => {
          if (child && (child as any).type === chakraComponents.MultiValue) return null;
          return child;
        })}
      </chakraComponents.ValueContainer>
    );
  }

  return (
    <chakraComponents.ValueContainer {...props}>
      {children}
    </chakraComponents.ValueContainer>
  );
};

// ─── Estilos comunes de los selects ──────────────────────────────────────────

const makeChakraStyles = (disabled: boolean) => ({
  control: (p: object) => ({
    ...p,
    bg: disabled ? 'brand.surfaceContainerLow' : 'brand.surfaceContainerLowest',
    rounded: 'lg',
    border: '1px solid',
    borderColor: 'brand.outlineVariant',
    minH: '40px',
    opacity: disabled ? 0.6 : 1,
  }),
  valueContainer: (p: object) => ({ ...p, gap: '4px' }),
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface FilterSectionProps {
  onBuscar?: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

const FilterSection: React.FC<FilterSectionProps> = ({ onBuscar }) => {
  const dispatch  = useAppDispatch();
  const filters   = useAppSelector((state) => state.filters);
  const catalogos = useAppSelector((state) => state.catalogos);

  const isLoadingCat = catalogos.isLoading;
  const chakraStyles = makeChakraStyles(isLoadingCat);
  const commonComponents = { ValueContainer: CustomValueContainer };
  const noOptions = () => isLoadingCat ? 'Cargando...' : 'Sin opciones disponibles';

  return (
    <Box bg="brand.surfaceContainerLow" p={4} rounded="xl" shadow="sm">
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={6}
        align={{ base: 'stretch', lg: 'center' }}
      >
        {/* ── Filtros ──────────────────────────────────────────────────────── */}
        <Box
          flex="1"
          maxH="325px"
          overflowY="auto"
          pr={2}
          sx={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { width: '6px' },
            '&::-webkit-scrollbar-thumb': {
              background: 'brand.outlineVariant',
              borderRadius: '24px',
            },
          }}
        >
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacingX={4} spacingY={3}>

            {/* Canal */}
            <FilterField label="Canal">
              <Select
                isMulti
                isDisabled={isLoadingCat}
                components={commonComponents}
                instanceId="canal-select"
                noOptionsMessage={noOptions}
                placeholder="Seleccionar..."
                options={catalogos.canales}
                value={filters.canal}
                onChange={(val) => dispatch(setCanal(val as unknown as FilterOption[]))}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
                chakraStyles={chakraStyles}
              />
            </FilterField>

            {/* Skill */}
            <FilterField label="Skill / Equipo">
              <Select
                isMulti
                isDisabled={isLoadingCat}
                components={commonComponents}
                instanceId="skill-select"
                noOptionsMessage={noOptions}
                placeholder="Seleccionar..."
                options={catalogos.skills}
                value={filters.skills}
                onChange={(val) => dispatch(setSkills(val as unknown as FilterOption[]))}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
                chakraStyles={chakraStyles}
              />
            </FilterField>

            {/* Red Social */}
            <FilterField label="Red Social">
              <Select
                isMulti
                isDisabled={isLoadingCat}
                components={commonComponents}
                instanceId="red-social-select"
                noOptionsMessage={noOptions}
                placeholder="Seleccionar..."
                options={catalogos.redesSociales}
                value={filters.redSocial}
                onChange={(val) => dispatch(setRedSocial(val as unknown as FilterOption[]))}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
                chakraStyles={chakraStyles}
              />
            </FilterField>

            {/* Tipo Usuario */}
            <FilterField label="Tipo de Usuario">
              <Select
                isMulti
                isDisabled={isLoadingCat}
                components={commonComponents}
                instanceId="tipo-usuario-select"
                noOptionsMessage={noOptions}
                placeholder="Seleccionar..."
                options={catalogos.tipoUsuario}
                value={filters.tipoUsuario}
                onChange={(val) => dispatch(setTipoUsuario(val as unknown as FilterOption[]))}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
                chakraStyles={chakraStyles}
              />
            </FilterField>

            {/* Gestiones */}
            <FilterField label="Gestiones">
              <Select
                isMulti
                isDisabled={isLoadingCat}
                components={commonComponents}
                instanceId="gestiones-select"
                noOptionsMessage={noOptions}
                placeholder="Seleccionar..."
                options={catalogos.gestiones}
                value={filters.gestiones}
                onChange={(val) => dispatch(setGestiones(val as unknown as FilterOption[]))}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
                chakraStyles={chakraStyles}
              />
            </FilterField>

            {/* Usuario que inicia */}
            <FilterField label="Usuario que inicia">
              <Select
                isMulti
                isDisabled={isLoadingCat}
                components={commonComponents}
                instanceId="usuario-inicia-select"
                noOptionsMessage={noOptions}
                placeholder="Seleccionar..."
                options={catalogos.operadores}
                value={filters.usuarioInicia}
                onChange={(val) => dispatch(setUsuarioInicia(val as unknown as FilterOption[]))}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
                chakraStyles={chakraStyles}
              />
            </FilterField>

            {/* Usuario que finaliza */}
            <FilterField label="Usuario que finaliza" labelMb="7px">
              <Select
                isMulti
                isDisabled={isLoadingCat}
                components={commonComponents}
                instanceId="usuario-finaliza-select"
                noOptionsMessage={noOptions}
                placeholder="Seleccionar..."
                options={catalogos.operadores}
                value={filters.usuarioFinaliza}
                onChange={(val) => dispatch(setUsuarioFinaliza(val as unknown as FilterOption[]))}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (b) => ({ ...b, zIndex: 9999 }) }}
                chakraStyles={chakraStyles}
              />
            </FilterField>

            {/* Temporalidad */}
            <VStack align="start" spacing={1}>
              <Flex justify="space-between" align="center" w="full" px={1}>
                <Text fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant">
                  Temporalidad
                </Text>
                <Flex
                  bg="brand.surfaceContainerLowest"
                  p={1}
                  rounded="md"
                  border="1px solid"
                  borderColor="brand.outlineVariant"
                >
                  <Button
                    size="xs" px={2}
                    variant={filters.queryMode === 'today' ? 'solid' : 'ghost'}
                    colorScheme={filters.queryMode === 'today' ? 'blue' : 'gray'}
                    onClick={() => dispatch(setQueryMode('today'))}
                    fontSize="9px" h="20px"
                  >
                    Hoy
                  </Button>
                  <Button
                    size="xs" px={2}
                    variant={filters.queryMode === 'range' ? 'solid' : 'ghost'}
                    colorScheme={filters.queryMode === 'range' ? 'blue' : 'gray'}
                    onClick={() => dispatch(setQueryMode('range'))}
                    fontSize="9px" h="20px"
                  >
                    Rango
                  </Button>
                </Flex>
              </Flex>

              {filters.queryMode === 'today' ? (
                <Flex
                  align="center" w="full" h="40px"
                  bg="brand.surfaceContainerLowest" px={4} rounded="lg"
                  border="1px solid" borderColor="brand.outlineVariant" shadow="sm"
                >
                  <Icon as={MdCalendarToday} color="brand.primary" mr={2} />
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    Consultando Hoy:{' '}
                    {new Date().toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </Text>
                </Flex>
              ) : (
                <Flex align="center" gap={2} w="full" h="40px">
                  <Input
                    type="date"
                    value={filters.fechaInicio.split('T')[0]}
                    onChange={(e) => dispatch(setFechaInicio(e.target.value))}
                    max={new Date(Date.now() - 86400000).toISOString().split('T')[0]}
                    bg="brand.surfaceContainerLowest" rounded="lg"
                    border="1px solid" borderColor="brand.outlineVariant"
                    shadow="sm" fontSize="xs" fontWeight="medium" size="md" h="40px"
                  />
                  <Text fontSize="xs" color="brand.onSurfaceVariant">al</Text>
                  <Input
                    type="date"
                    value={filters.fechaFin.split('T')[0]}
                    onChange={(e) => dispatch(setFechaFin(e.target.value))}
                    max={new Date(Date.now() - 86400000).toISOString().split('T')[0]}
                    min={filters.fechaInicio.split('T')[0]}
                    bg="brand.surfaceContainerLowest" rounded="lg"
                    border="1px solid" borderColor="brand.outlineVariant"
                    shadow="sm" fontSize="xs" fontWeight="medium" size="md" h="40px"
                  />
                </Flex>
              )}
            </VStack>

          </SimpleGrid>
        </Box>

        {/* ── Botones ──────────────────────────────────────────────────────── */}
        <VStack spacing={2} minW={{ lg: '150px' }} align="stretch" justify="center">
          <Button
            variant="outline"
            borderColor="brand.primary"
            color="brand.primary"
            _hover={{ bg: 'brand.primaryContainer' }}
            leftIcon={isLoadingCat ? <Spinner size="xs" /> : <Icon as={MdSearch} />}
            shadow="md"
            w="full"
            isDisabled={isLoadingCat}
            onClick={onBuscar}
          >
            {isLoadingCat ? 'Cargando...' : 'Buscar'}
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

          {/* Toggle Periodo / Resumen — solo visible en modo Rango */}
          {filters.queryMode === 'range' && (
            <Box
              bg="brand.surfaceContainerLowest"
              border="1px solid"
              borderColor="brand.outlineVariant"
              rounded="lg"
              p={1.5}
              shadow="sm"
            >
              <Flex align="center" gap={1} mb={1}>
                <Icon as={MdCompareArrows} fontSize="xs" color="brand.onSurfaceVariant" />
                <Text fontSize="9px" fontWeight="bold" color="brand.onSurfaceVariant" textTransform="uppercase" letterSpacing="wider">
                  Fuente de datos
                </Text>
              </Flex>
              <Flex
                bg="brand.surfaceContainerLow"
                p={0.5}
                rounded="md"
                border="1px solid"
                borderColor="brand.outlineVariant"
              >
                <Button
                  size="xs" px={2} flex={1}
                  variant={filters.periodoSource === 'periodo' ? 'solid' : 'ghost'}
                  colorScheme={filters.periodoSource === 'periodo' ? 'blue' : 'gray'}
                  onClick={() => dispatch(setPeriodoSource('periodo'))}
                  fontSize="9px" h="20px"
                >
                  Periodo
                </Button>
                <Button
                  size="xs" px={2} flex={1}
                  variant={filters.periodoSource === 'resumen' ? 'solid' : 'ghost'}
                  colorScheme={filters.periodoSource === 'resumen' ? 'teal' : 'gray'}
                  onClick={() => dispatch(setPeriodoSource('resumen'))}
                  fontSize="9px" h="20px"
                >
                  Resumen
                </Button>
              </Flex>
            </Box>
          )}
        </VStack>
      </Flex>
    </Box>
  );
};

// ─── Campo de filtro con label ────────────────────────────────────────────────

const FilterField: React.FC<{
  label: string;
  labelMb?: string;
  children: React.ReactNode;
}> = ({ label, labelMb, children }) => (
  <VStack align="start" spacing={1}>
    <Text
      fontSize="xs"
      fontWeight="bold"
      color="brand.onSurfaceVariant"
      ml={1}
      mb={labelMb}
    >
      {label}
    </Text>
    <Box w="full">{children}</Box>
  </VStack>
);

export default FilterSection;
