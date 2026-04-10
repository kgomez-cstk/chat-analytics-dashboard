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
  Icon,
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
import type { TiemposAtencionRow } from '../../types';

const columnHelper = createColumnHelper<TiemposAtencionRow>();

const TiemposAtencionTable: React.FC = () => {
  const data = useAppSelector((state) => state.dashboard.tiemposAtencion);
  const pageSize = useAppSelector((state) => state.user.elmtPaginado);

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
        header: 'Clientes Únicos',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('abandonoAsesor', {
        header: 'Abandono Asesor',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('porcentajeAbandono', {
        header: '% Abandono',
        cell: (info) => `${info.getValue().toFixed(2)}%`,
      }),
      columnHelper.accessor('cantidadConversaciones', {
        header: 'Cantidad de Conversaciones',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('tiempoEnCola', {
        header: 'Tiempo en Cola',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('tmeOperador', {
        header: 'TME',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('tmo', {
        header: 'TMO',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('tma', {
        header: 'TMA',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('tmr', {
        header: 'TMR',
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );

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
    const totalClientes = data.reduce((sum, row) => sum + (row.clientesUnicos || 0), 0);
    const totalAbandono = data.reduce((sum, row) => sum + (row.abandonoAsesor || 0), 0);
    const totalConversaciones = data.reduce((sum, row) => sum + (row.cantidadConversaciones || 0), 0);
    const avgAbandonoPct = totalConversaciones > 0 ? (totalAbandono / totalConversaciones) * 100 : 0;
    
    // Dummy totals for now since values are formatted strings
    return {
      clientesUnicos: totalClientes,
      abandonoAsesor: totalAbandono,
      porcentajeAbandono: `${avgAbandonoPct.toFixed(2)}%`,
      cantidadConversaciones: totalConversaciones,
      tiempoEnCola: '00:03:52', // Dummy total/average
      tma: '01:57:12',
      tme: '00:21:01',
      tmo: '00:35:25',
      tmr: '00:28:40',
    };
  }, [data]);

  return (
    <Box
      bg="brand.surfaceContainerLowest"
      rounded="xl"
      shadow="sm"
      border="1px solid"
      borderColor="brand.outlineVariant"
      overflow="hidden"
    >
      <Box overflowX="auto">
        <Table variant="simple" size="sm" border="1px solid" borderColor="brand.outlineVariant">
          <Thead>
            {/* Header Level 1: "Desde" 
            <Tr bg="gray.50">
              <Th colSpan={2} color="gray.600" textAlign="right" py={2} borderRight="1px solid" borderColor="brand.outlineVariant">Desde:</Th>
              <Th color="orange.600" fontSize="10px" borderRight="1px solid" borderColor="brand.outlineVariant">Ingreso de conversación al canal</Th>
              <Th color="purple.600" fontSize="10px" borderRight="1px solid" borderColor="brand.outlineVariant">Que se asigna la conversación a AVO</Th>
              <Th color="blue.600" fontSize="10px" borderRight="1px solid" borderColor="brand.outlineVariant">Conversación asignada a AVO</Th>
              <Th color="green.600" fontSize="10px">Ingreso de conversación al canal</Th>
            </Tr>
            */}
            {/* Header Level 2: "Hasta" 
            <Tr bg="gray.50">
              <Th colSpan={2} color="gray.600" textAlign="right" py={2} borderRight="1px solid" borderColor="brand.outlineVariant">Hasta:</Th>
              <Th color="orange.600" fontSize="10px" borderRight="1px solid" borderColor="brand.outlineVariant">AVO finaliza conversación</Th>
              <Th color="purple.600" fontSize="10px" borderRight="1px solid" borderColor="brand.outlineVariant">Primera respuesta de AVO</Th>
              <Th color="blue.600" fontSize="10px" borderRight="1px solid" borderColor="brand.outlineVariant">AVO finaliza conversación</Th>
              <Th color="green.600" fontSize="10px">Primera respuesta de AVO</Th>
            </Tr>
            */}
            {/* Header Level 3: Definition and Main Header */}
            <Tr bg="gray.100">
              <Th py={3} borderRight="1px solid" borderColor="brand.outlineVariant">No.</Th>
              <Th py={3} borderRight="1px solid" borderColor="brand.outlineVariant" textAlign="center">Asesor</Th>
               <Th py={3} borderRight="1px solid" borderColor="brand.outlineVariant" textAlign="center">
                Clientes<br/>Únicos
              </Th>
              <Th py={3} borderRight="1px solid" borderColor="brand.outlineVariant" textAlign="center">
                Abandono<br/>Asesor
              </Th>
              <Th py={3} borderRight="1px solid" borderColor="brand.outlineVariant" textAlign="center">
                %<br/>Abandono
              </Th>
              <Th py={3} borderRight="1px solid" borderColor="brand.outlineVariant" textAlign="center">
                Cantidad de<br/>Conversaciones
              </Th>
              <Th py={3} borderRight="1px solid" borderColor="brand.outlineVariant" textAlign="center">
                Tiempo en<br/>Cola
              </Th>
              <Th textAlign="center" borderRight="1px solid" borderColor="brand.outlineVariant">
                {/*<Text fontSize="10px" color="gray.600" mb={1}>Tiempo Medio Espera Operador</Text>*/}
                <Box bg="purple.700" color="white" py={2} rounded="sm">TME Operador</Box>
              </Th>
              <Th textAlign="center" borderRight="1px solid" borderColor="brand.outlineVariant">
                {/*<Text fontSize="10px" color="gray.600" mb={1}>Tiempo Medio de Operación</Text>*/}
                <Box bg="blue.700" color="white" py={2} rounded="sm">TMO</Box>
              </Th>
              <Th textAlign="center" borderRight="1px solid" borderColor="brand.outlineVariant">
                {/*<Text fontSize="10px" color="gray.600" mb={1}>Tiempo Medio de Atención</Text>*/}
                <Box bg="orange.600" color="white" py={2} rounded="sm">TMA</Box>
              </Th>
              <Th textAlign="center">
                {/*<Text fontSize="10px" color="gray.600" mb={1}>Tiempo Medio de Respuesta</Text>*/}
                <Box bg="green.600" color="white" py={2} rounded="sm">TMR</Box>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr
                key={row.id}
                _hover={{ bg: 'brand.surfaceContainerLow' }}
                transition="background 0.2s"
              >
                {row.getVisibleCells().map((cell, idx) => (
                  <Td
                    key={cell.id}
                    py={3}
                    fontSize="sm"
                    borderRight="1px solid"
                    borderColor="brand.outlineVariant"
                    textAlign={idx > 1 ? "center" : "left"}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr bg="gray.100" fontWeight="bold">
              <Td colSpan={2} py={3} fontSize="sm" textAlign="center" borderRight="1px solid" borderColor="brand.outlineVariant">
                TOTAL EQUIPO
              </Td>
              <Td textAlign="center" borderRight="1px solid" borderColor="brand.outlineVariant">{totals.clientesUnicos}</Td>
              <Td textAlign="center" borderRight="1px solid" borderColor="brand.outlineVariant">{totals.abandonoAsesor}</Td>
              <Td textAlign="center" borderRight="1px solid" borderColor="brand.outlineVariant">{totals.porcentajeAbandono}</Td>
              <Td textAlign="center" borderRight="1px solid" borderColor="brand.outlineVariant">{totals.cantidadConversaciones}</Td>
              <Td textAlign="center" borderRight="1px solid" borderColor="brand.outlineVariant">{totals.tiempoEnCola}</Td>
              <Td textAlign="center" bg="purple.700" color="white" borderRight="1px solid" borderColor="brand.outlineVariant">{totals.tme}</Td>
              <Td textAlign="center" bg="blue.700" color="white" borderRight="1px solid" borderColor="brand.outlineVariant">{totals.tmo}</Td>
              <Td textAlign="center" bg="orange.600" color="white" borderRight="1px solid" borderColor="brand.outlineVariant">{totals.tma}</Td>
              <Td textAlign="center" bg="green.600" color="white">{totals.tmr}</Td>
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

export default TiemposAtencionTable;
