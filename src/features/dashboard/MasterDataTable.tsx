import React, { memo, useState, useCallback, useMemo, useEffect } from 'react';
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Button,
} from '@chakra-ui/react';
import { MdDownload } from 'react-icons/md';
import { useAppSelector } from '../../hooks/useRedux';
import type { MasterDataRow } from '../../types';
import { exportToXLSX, exportToCSV } from '../../utils/exporters';

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface RowVM {
  row:        MasterDataRow;
  isCollapsed: boolean;
  onToggle?:  () => void;
}

// ─── Componente principal ─────────────────────────────────────────────────────

const MasterDataTable: React.FC = () => {
  const masterData = useAppSelector((state) => state.dashboard.masterData);
  const userData = useAppSelector((state) => state.user.userData);
  const toast = useToast();

  const rawElements = userData?.elementosPagina ?? userData?.elmtPaginado ?? 20;
  const elementsPerPage = rawElements < 1 ? 20 : rawElements;

  const [currentPage, setCurrentPage] = useState(1);

  // Volver a la página 1 cuando cambien los datos
  useEffect(() => {
    setCurrentPage(1);
  }, [masterData]);

  const handleExportMaster = (format: 'xlsx' | 'csv') => {
    const columns = [
      { accessorKey: 'type', header: 'Jerarquía (Canal/Skill/Usuario)' },
      { accessorKey: 'label', header: 'Nombre' },
      { accessorKey: 'conv', header: 'Cant. Conversaciones' },
      { accessorKey: 'clientes', header: 'Clientes Únicos' },
      { accessorKey: 'cola', header: 'Tiempo en Cola' },
      { accessorKey: 'tme', header: 'TME' },
      { accessorKey: 'tmo', header: 'TMO' },
      { accessorKey: 'tma', header: 'TMA' },
      { accessorKey: 'tmr', header: 'TMR' },
    ];
    
    if (format === 'xlsx') {
      const rowLevelFn = (row: MasterDataRow) => {
        if (row.type === 'canal') return 0;
        if (row.type === 'skill') return 1;
        return 2;
      };
      exportToXLSX(masterData, columns, 'Tabla_Maestra', toast, undefined, undefined, rowLevelFn);
    } else {
      exportToCSV(masterData, columns, 'Tabla_Maestra', toast);
    }
  };

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

  const totalPages = Math.ceil(masterData.length / elementsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const renderRows = useMemo<RowVM[]>(() => {
    const start = (currentPage - 1) * elementsPerPage;
    const paginatedRaw = masterData.slice(start, start + elementsPerPage);
    
    const rows: RowVM[] = [];
    if (paginatedRaw.length === 0) return rows;

    let currentCanal = '';
    let currentSkillKey = '';

    // 1. Determinar el contexto (padres) de la fila inicial buscando hacia atrás
    let contextCanalRow: MasterDataRow | null = null;
    let contextSkillRow: MasterDataRow | null = null;

    for (let i = 0; i < start; i++) {
      if (masterData[i].type === 'canal') {
        contextCanalRow = masterData[i];
        contextSkillRow = null;
      } else if (masterData[i].type === 'skill') {
        contextSkillRow = masterData[i];
      }
    }

    const firstItem = paginatedRaw[0];

    // 2. Inyectar contexto si es necesario
    if (firstItem.type === 'skill' && contextCanalRow) {
      currentCanal = contextCanalRow.label;
      const isCollapsed = collapsedCanals.has(contextCanalRow.label);
      rows.push({
        row: contextCanalRow,
        isCollapsed,
        onToggle: () => toggleCanal(contextCanalRow!.label),
      });
    } else if (firstItem.type === 'user' && contextCanalRow) {
      currentCanal = contextCanalRow.label;
      const canalCollapsed = collapsedCanals.has(contextCanalRow.label);
      rows.push({
        row: contextCanalRow,
        isCollapsed: canalCollapsed,
        onToggle: () => toggleCanal(contextCanalRow!.label),
      });

      if (!canalCollapsed && contextSkillRow) {
        currentSkillKey = `${currentCanal}::${contextSkillRow.label}`;
        const skillCollapsed = collapsedSkills.has(currentSkillKey);
        rows.push({
          row: contextSkillRow,
          isCollapsed: skillCollapsed,
          onToggle: () => toggleSkill(currentSkillKey),
        });
      }
    }

    // 3. Procesar las filas de la página actual
    for (const row of paginatedRaw) {
      if (row.type === 'canal') {
        currentCanal = row.label;
        currentSkillKey = '';
        const isCollapsed = collapsedCanals.has(row.label);
        rows.push({
          row,
          isCollapsed,
          onToggle: () => toggleCanal(row.label),
        });
      } else if (row.type === 'skill') {
        if (collapsedCanals.has(currentCanal)) continue;
        currentSkillKey = `${currentCanal}::${row.label}`;
        const isCollapsed = collapsedSkills.has(currentSkillKey);
        rows.push({
          row,
          isCollapsed,
          onToggle: () => toggleSkill(currentSkillKey),
        });
      } else {
        // user
        if (collapsedCanals.has(currentCanal)) continue;
        if (collapsedSkills.has(currentSkillKey)) continue;
        rows.push({ row, isCollapsed: false });
      }
    }

    // 4. Eliminar agrupadores huérfanos al final de la página (si fueron cortados por la paginación)
    const nextItem = masterData[start + elementsPerPage];
    if (nextItem) {
      while (rows.length > 0) {
        const lastRow = rows[rows.length - 1].row;
        if (lastRow.type === 'user') break;
        
        // Si el último es un skill y el siguiente elemento real es un usuario (su hijo), el skill quedó cortado
        if (lastRow.type === 'skill' && nextItem.type === 'user') {
          rows.pop();
        } 
        // Si el último es un canal y el siguiente es un skill o usuario (sus hijos), el canal quedó cortado
        else if (lastRow.type === 'canal' && (nextItem.type === 'skill' || nextItem.type === 'user')) {
          rows.pop();
        } else {
          break;
        }
      }
    }

    return rows;
  }, [masterData, currentPage, elementsPerPage, collapsedCanals, collapsedSkills, toggleCanal, toggleSkill]);

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
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Exportar"
              icon={<Icon as={MdDownload} />}
              variant="ghost"
              color="gray.500"
              _hover={{ bg: 'gray.100' }}
            />
            <MenuList>
              <MenuItem onClick={() => handleExportMaster('xlsx')}>Exportar a Excel</MenuItem>
              <MenuItem onClick={() => handleExportMaster('csv')}>Exportar a CSV</MenuItem>
            </MenuList>
          </Menu>
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
              renderRows.map(({ row, isCollapsed, onToggle }, idx) => (
                <MasterRow
                  key={`${row.type}-${row.label}-${idx}`}
                  row={row}
                  isCollapsed={isCollapsed}
                  onToggle={onToggle}
                />
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Footer y Paginación */}
      <Flex
        px={6} py={4}
        bg="gray.50"
        borderTop="1px solid"
        borderColor="blackAlpha.100"
        justify="space-between"
        align="center"
        flexWrap="wrap"
        gap={4}
      >
        <Text fontSize="xs" color="gray.500" fontWeight="medium">
          {masterData.length > 0
            ? `Mostrando página ${currentPage} de ${totalPages} (Total datos: ${masterData.length})`
            : 'Sin datos cargados'}
        </Text>

        {masterData.length > 0 && (
          <Flex gap={2} align="center">
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              isDisabled={currentPage === 1}
              colorScheme="blue"
              variant="outline"
            >
              Anterior
            </Button>
            <Text fontSize="sm" fontWeight="medium" color="gray.700" mx={2}>
              Página {currentPage} de {totalPages}
            </Text>
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              isDisabled={currentPage === totalPages}
              colorScheme="blue"
              variant="outline"
            >
              Siguiente
            </Button>
          </Flex>
        )}
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
