import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { MdDownload } from 'react-icons/md';
import { useAppSelector } from '../../hooks/useRedux';
import type { MasterDataRow } from '../../types';

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface RowVM {
  row:        MasterDataRow;
  isCollapsed: boolean;
  onToggle?:  () => void;
}

// ─── Componente principal ─────────────────────────────────────────────────────

const MasterDataTable: React.FC = () => {
  const masterData = useAppSelector((state) => state.dashboard.masterData);

  // Conjuntos de labels colapsados (canal y skill con clave compuesta)
  const [collapsedCanals, setCollapsedCanals] = useState<Set<string>>(new Set());
  const [collapsedSkills, setCollapsedSkills] = useState<Set<string>>(new Set());

  const toggleCanal = useCallback((label: string) => {
    setCollapsedCanals((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }, []);

  const toggleSkill = useCallback((key: string) => {
    setCollapsedSkills((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  /**
   * Recorre el array plano manteniendo contexto de canal/skill actual.
   * - Omite filas hijas cuando su padre está colapsado.
   * - Adjunta estado de colapso y callback de toggle a cada fila visible.
   */
  const visibleRows = useMemo<RowVM[]>(() => {
    let currentCanal    = '';
    let currentSkillKey = '';
    const result: RowVM[] = [];

    for (const row of masterData) {
      if (row.type === 'canal') {
        currentCanal    = row.label;
        currentSkillKey = '';
        const isCollapsed = collapsedCanals.has(row.label);
        const label = row.label;
        result.push({
          row,
          isCollapsed,
          onToggle: () => toggleCanal(label),
        });

      } else if (row.type === 'skill') {
        // Ocultar si el canal padre está colapsado
        if (collapsedCanals.has(currentCanal)) continue;
        currentSkillKey  = `${currentCanal}::${row.label}`;
        const isCollapsed = collapsedSkills.has(currentSkillKey);
        const skillKey   = currentSkillKey;
        result.push({
          row,
          isCollapsed,
          onToggle: () => toggleSkill(skillKey),
        });

      } else {
        // user — ocultar si canal o skill padre están colapsados
        if (collapsedCanals.has(currentCanal))    continue;
        if (collapsedSkills.has(currentSkillKey)) continue;
        result.push({ row, isCollapsed: false });
      }
    }

    return result;
  }, [masterData, collapsedCanals, collapsedSkills, toggleCanal, toggleSkill]);

  return (
    <Box
      bg="brand.surfaceContainerLowest"
      rounded="xl"
      shadow="sm"
      border="1px solid"
      borderColor="brand.outlineVariant"
      overflow="hidden"
      mb={10}
    >
      {/* Header */}
      <Flex
        px={6}
        py={4}
        borderBottom="1px solid"
        borderColor="brand.surfaceContainerHigh"
        justify="space-between"
        align="center"
      >
        <Text fontFamily="heading" fontWeight="bold" color="gray.900">
          Tabla Maestra de Datos
        </Text>
        <Flex gap={2}>
          <IconButton
            aria-label="Exportar Excel"
            icon={<Icon as={MdDownload} />}
            variant="ghost"
            color="gray.500"
            _hover={{ bg: 'gray.100' }}
            onClick={() => console.log('Exportar maestra...')}
          />
        </Flex>
      </Flex>

      {/* Tabla */}
      <TableContainer>
        <Table variant="unstyled" w="full">
          <Thead bg="brand.surfaceContainerHigh">
            <Tr>
              <Th
                px={6} py={4}
                fontSize="xs" fontWeight="bold"
                color="brand.onSurfaceVariant"
                textTransform="uppercase" letterSpacing="wider"
              >
                Estructura Jerárquica (Canal / Skill / Usuario)
              </Th>
              {['Cant. Conversaciones', 'Clientes Únicos', 'Tiempo en Cola', 'TME', 'TMO', 'TMA', 'TMR'].map((h) => (
                <Th
                  key={h}
                  px={3} py={4}
                  fontSize="xs" fontWeight="bold"
                  color="brand.onSurfaceVariant"
                  textTransform="uppercase" letterSpacing="wider"
                  textAlign="center"
                >
                  {h}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {masterData.length === 0 ? (
              <Tr>
                <Td colSpan={8} textAlign="center" py={10} color="gray.400" fontSize="sm">
                  Sin datos. Presiona <strong>Buscar</strong> para cargar la información.
                </Td>
              </Tr>
            ) : (
              visibleRows.map(({ row, isCollapsed, onToggle }, idx) => (
                <MasterRow
                  key={idx}
                  row={row}
                  isCollapsed={isCollapsed}
                  onToggle={onToggle}
                />
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <Flex
        px={6} py={4}
        bg="gray.50"
        borderTop="1px solid"
        borderColor="blackAlpha.100"
        justify="space-between"
        align="center"
      >
        <Text fontSize="xs" color="gray.500" fontWeight="medium">
          {masterData.length > 0
            ? `${visibleRows.length} de ${masterData.length} registros visibles`
            : 'Sin datos cargados'}
        </Text>
      </Flex>
    </Box>
  );
};

// ─── Fila individual ──────────────────────────────────────────────────────────

interface MasterRowProps {
  row:        MasterDataRow;
  isCollapsed: boolean;
  onToggle?:  () => void;
}

const MasterRow: React.FC<MasterRowProps> = memo(({ row, isCollapsed, onToggle }) => {
  let rowBg: string | undefined;
  let hoverBg: string;
  let pl: string;

  if (row.type === 'canal') {
    rowBg   = 'blue.50';
    hoverBg = 'blue.100';
    pl      = '8';
  } else if (row.type === 'skill') {
    rowBg   = 'gray.50';
    hoverBg = 'gray.100';
    pl      = '16';
  } else {
    rowBg   = undefined;
    hoverBg = 'gray.50';
    pl      = '24';
  }

  const py = row.type === 'canal' ? 4 : row.type === 'skill' ? 3 : 2;

  return (
    <Tr
      bg={rowBg}
      _hover={{ bg: hoverBg }}
      transition="background 0.15s"
      borderBottom="1px solid"
      borderColor="blackAlpha.50"
    >
      <Td px={6} py={py} pl={pl}>
        <Flex align="center" gap={2}>

          {/* Flecha colapsable (solo canal y skill) */}
          {row.type !== 'user' && (
            <Box
              as="span"
              className="material-symbols-outlined"
              fontSize="20px"
              color={row.type === 'canal' ? 'blue.500' : 'gray.400'}
              cursor="pointer"
              userSelect="none"
              display="inline-flex"
              alignItems="center"
              /* Rota 0° = colapsado (→), 90° = expandido (↓) */
              transform={isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)'}
              transition="transform 0.2s ease"
              onClick={onToggle}
              _hover={{ color: row.type === 'canal' ? 'blue.700' : 'gray.600' }}
              title={isCollapsed ? 'Expandir' : 'Colapsar'}
            >
              chevron_right
            </Box>
          )}

          {/* Ícono de tipo (chat / build) */}
          {row.type !== 'user' && (
            <Box
              as="span"
              className="material-symbols-outlined"
              fontSize="18px"
              color={row.type === 'canal' ? 'blue.600' : 'gray.400'}
            >
              {row.icon}
            </Box>
          )}

          {/* Nombre */}
          <Text
            fontFamily={row.type === 'canal' ? 'heading' : 'body'}
            fontWeight={row.type === 'canal' ? 'extrabold' : row.type === 'skill' ? 'bold' : 'medium'}
            color={row.type === 'canal' ? 'blue.900' : row.type === 'skill' ? 'gray.700' : 'gray.600'}
            fontSize={row.type === 'user' ? 'sm' : 'md'}
          >
            {row.label}
          </Text>
        </Flex>
      </Td>

      <Td px={3} py={py} textAlign="center" fontWeight={row.type !== 'user' ? 'bold' : 'normal'} color="gray.900" fontSize={row.type === 'user' ? 'sm' : 'md'}>
        {row.conv.toLocaleString()}
      </Td>
      <Td px={3} py={py} textAlign="center" fontWeight={row.type !== 'user' ? 'bold' : 'normal'} color="gray.900" fontSize={row.type === 'user' ? 'sm' : 'md'}>
        {row.clientes.toLocaleString()}
      </Td>
      <Td px={3} py={py} textAlign="center" color="gray.600" fontSize="sm">{row.cola}</Td>
      <Td px={3} py={py} textAlign="center" color="gray.600" fontSize="sm">{row.tme}</Td>
      <Td px={3} py={py} textAlign="center" color="gray.600" fontSize="sm">{row.tmo}</Td>
      <Td px={3} py={py} textAlign="center" color="gray.600" fontSize="sm">{row.tma}</Td>
      <Td px={3} py={py} textAlign="center" color="gray.600" fontSize="sm">{row.tmr}</Td>
    </Tr>
  );
});

export default MasterDataTable;
