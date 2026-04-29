import React, { memo } from 'react';
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

const MasterDataTable: React.FC = () => {
  const masterData = useAppSelector((state) => state.dashboard.masterData);

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

      <TableContainer>
        <Table variant="unstyled" w="full">
          <Thead bg="brand.surfaceContainerHigh">
            <Tr>
              <Th
                px={6}
                py={4}
                fontSize="xs"
                fontWeight="bold"
                color="brand.onSurfaceVariant"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Estructura Jerárquica (Canal / Skill / Usuario)
              </Th>
              {['Cant. Conversaciones', 'Clientes Únicos', 'Tiempo en Cola', 'TME', 'TMO', 'TMA', 'TMR'].map(
                (h) => (
                  <Th
                    key={h}
                    px={3}
                    py={4}
                    fontSize="xs"
                    fontWeight="bold"
                    color="brand.onSurfaceVariant"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    textAlign="center"
                  >
                    {h}
                  </Th>
                )
              )}
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
              masterData.map((row: MasterDataRow, idx: number) => (
                <MasterRow key={idx} row={row} />
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex
        px={6}
        py={4}
        bg="gray.50"
        borderTop="1px solid"
        borderColor="blackAlpha.100"
        justify="space-between"
        align="center"
      >
        <Text fontSize="xs" color="gray.500" fontWeight="medium">
          {masterData.length > 0
            ? `${masterData.length} registros jerárquicos`
            : 'Sin datos cargados'}
        </Text>
      </Flex>
    </Box>
  );
};

// ─── Fila individual (separada para evitar re-renders innecesarios) ───────────

const MasterRow: React.FC<{ row: MasterDataRow }> = memo(({ row }) => {
  let rowBg: string | undefined;
  let hoverBg: string;
  let pl: string;

  if (row.type === 'canal') {
    rowBg  = 'blue.50';
    hoverBg = 'blue.100';
    pl      = '8';
  } else if (row.type === 'skill') {
    rowBg  = 'gray.50';
    hoverBg = 'gray.100';
    pl      = '16';
  } else {
    rowBg  = undefined;
    hoverBg = 'gray.50';
    pl      = '24';
  }

  const py = row.type === 'canal' ? 4 : row.type === 'skill' ? 3 : 2;

  return (
    <Tr
      bg={rowBg}
      _hover={{ bg: hoverBg }}
      transition="colors 0.2s"
      borderBottom="1px solid"
      borderColor="blackAlpha.50"
    >
      <Td px={6} py={py} pl={pl}>
        <Flex align="center" gap={3}>
          {row.type !== 'user' && (
            <>
              <Box
                as="span"
                className="material-symbols-outlined"
                color={row.type === 'canal' ? 'blue.600' : 'gray.400'}
              >
                {row.type === 'canal' ? 'chevron_right' : 'keyboard_arrow_right'}
              </Box>
              <Box
                as="span"
                className="material-symbols-outlined"
                color={row.type === 'canal' ? 'blue.600' : 'gray.400'}
              >
                {row.icon}
              </Box>
            </>
          )}
          <Text
            fontFamily={row.type === 'canal' ? 'heading' : 'body'}
            fontWeight={
              row.type === 'canal' ? 'extrabold' : row.type === 'skill' ? 'bold' : 'medium'
            }
            color={
              row.type === 'canal' ? 'blue.900' : row.type === 'skill' ? 'gray.700' : 'gray.600'
            }
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
