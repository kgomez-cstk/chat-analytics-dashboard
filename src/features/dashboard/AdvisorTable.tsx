import React, { useMemo } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Text,
  Flex,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import {
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage
} from 'react-icons/md';
import { useAppSelector } from '../../hooks/useRedux';
import type { AdvisorRow } from '../../types';

const columnHelper = createColumnHelper<AdvisorRow>();

// ─── Helpers ───
const timeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // HH:MM
    return parts[0] * 3600 + parts[1] * 60;
  }
  return 0;
};

const secondsToTime = (totalSeconds: number, format: 'HMS' | 'HM'): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (format === 'HMS') {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(h)}:${pad(m)}`;
};

const AdvisorTable: React.FC = () => {
  const data = useAppSelector((state) => state.dashboard.advisors);

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'No.',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('nombre', {
        header: 'Asesor',
        cell: (info) => (
          <Text fontSize="sm" fontWeight="medium" color="brand.onSurface">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('clientesUnicos', {
        header: 'Clientes únicos',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('conversacionesTotales', {
        header: 'Total de conversaciones',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('abandonoAsesor', {
        header: 'Abandono por asesor',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('porcentajeAbandono', {
        header: '% de abandono',
        cell: (info) => (
          <Flex justify="center">
            <Text fontSize="sm">
              {info.getValue().toFixed(2)}%
            </Text>
          </Flex>
        ),
      }),
      columnHelper.accessor('tiempoEnLinea', {
        header: 'Tiempo en línea',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('promedioDiarioLinea', {
        header: 'Promedio tiempo en línea',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('tiempoEnPausa', {
        header: 'Tiempo en pausa',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('promedioDiarioPausa', {
        header: 'Promedio diario en pausa',
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );


  const pageSize = useAppSelector((state) => state.user.elmtPaginado);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  const totals = useMemo(() => {
    const counts = data.reduce(
      (acc, curr) => ({
        clientes: acc.clientes + curr.clientesUnicos,
        totales: acc.totales + curr.conversacionesTotales,
        abandono: acc.abandono + curr.abandonoAsesor,
        secLinea: acc.secLinea + timeToSeconds(curr.tiempoEnLinea),
        secPromLinea: acc.secPromLinea + timeToSeconds(curr.promedioDiarioLinea),
        secPausa: acc.secPausa + timeToSeconds(curr.tiempoEnPausa),
        secPromPausa: acc.secPromPausa + timeToSeconds(curr.promedioDiarioPausa),
      }),
      {
        clientes: 0,
        totales: 0,
        abandono: 0,
        secLinea: 0,
        secPromLinea: 0,
        secPausa: 0,
        secPromPausa: 0,
      }
    );

    const count = data.length || 1;

    return {
      ...counts,
      avgLinea: secondsToTime(Math.floor(counts.secLinea / count), 'HMS'),
      avgPromLinea: secondsToTime(Math.floor(counts.secPromLinea / count), 'HM'),
      avgPausa: secondsToTime(Math.floor(counts.secPausa / count), 'HMS'),
      avgPromPausa: secondsToTime(Math.floor(counts.secPromPausa / count), 'HM'),
    };
  }, [data]);

  const avgPercentAbandono = totals.totales > 0 ? (totals.abandono / totals.totales) * 100 : 0;

  return (
    <Box
      bg="brand.surfaceContainerLowest"
      rounded="xl"
      shadow="sm"
      border="1px solid"
      borderColor="brand.outlineVariant"
      overflow="hidden"
    >
      {/* Table Header Row */}
      <Flex
        px={6}
        py={4}
        borderBottom="1px solid"
        borderColor="brand.outlineVariant"
        bg="brand.surfaceContainerHigh"
        justify="space-between"
        align="center"
      >
        <Text fontFamily="heading" fontWeight="bold" color="brand.onSurface">
          Detalle por Asesor
        </Text>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple" size="md">
          {/* ... table content remains same ... */}
          <Thead bg="brand.surfaceContainerHigh">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    color="brand.onSurfaceVariant"
                    fontSize="11px"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontWeight="bold"
                    py={4}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr
                key={row.id}
                _hover={{ bg: 'brand.surfaceContainerLow' }}
                transition="background 0.2s"
              >
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id} py={5} fontSize="sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr bg="brand.surfaceContainerHigh" fontWeight="bold">
              <Td colSpan={2} py={5} fontSize="sm">
                TOTAL EQUIPO
              </Td>
              <Td>{totals.clientes}</Td>
              <Td>{totals.totales}</Td>
              <Td>{totals.abandono}</Td>
              <Td textAlign="center">
                {avgPercentAbandono.toFixed(2)}%
              </Td>
              <Td>{totals.avgLinea}</Td>
              <Td>{totals.avgPromLinea}</Td>
              <Td>{totals.avgPausa}</Td>
              <Td>{totals.avgPromPausa}</Td>
            </Tr>
          </Tfoot>
        </Table>
      </Box>

      {/* Pagination Controls */}
      <Flex
        px={6}
        py={4}
        bg="brand.surfaceContainerHigh"
        justify="space-between"
        align="center"
        borderTop="1px solid"
        borderColor="brand.outlineVariant"
      >
        <Text fontSize="xs" fontWeight="medium" color="brand.onSurfaceVariant">
          Mostrando {table.getRowModel().rows.length > 0 ? table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 : 0} a{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            data.length
          )}{' '}
          de {data.length} elementos
        </Text>

        <Flex gap={2}>
          <Box
            as="button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            p={1}
            rounded="md"
            _hover={{ bg: 'brand.surfaceContainerLow' }}
            _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
          >
            <MdFirstPage fontSize="20px" />
          </Box>
          <Box
            as="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            p={1}
            rounded="md"
            _hover={{ bg: 'brand.surfaceContainerLow' }}
            _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
          >
            <MdChevronLeft fontSize="20px" />
          </Box>

          <Flex align="center" px={2}>
            <Text fontSize="xs" fontWeight="bold">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </Text>
          </Flex>

          <Box
            as="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            p={1}
            rounded="md"
            _hover={{ bg: 'brand.surfaceContainerLow' }}
            _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
          >
            <MdChevronRight fontSize="20px" />
          </Box>
          <Box
            as="button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            p={1}
            rounded="md"
            _hover={{ bg: 'brand.surfaceContainerLow' }}
            _disabled={{ opacity: 0.4, cursor: 'not-allowed' }}
          >
            <MdLastPage fontSize="20px" />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AdvisorTable;
