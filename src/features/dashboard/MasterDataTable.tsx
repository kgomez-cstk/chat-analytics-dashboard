import React from 'react';
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
  Button,
} from '@chakra-ui/react';
import { MdDownload } from 'react-icons/md';

const masterData = [
  {
    type: 'canal',
    label: 'WhatsApp Business',
    icon: 'chat',
    conv: '1,240',
    cola: '00:02:15',
    tme: '00:00:45',
    tmo: '00:08:30',
    tma: '00:10:45',
    tmr: '00:01:20',
  },
  {
    type: 'skill',
    label: 'Ventas Directas (LATAM)',
    icon: 'build',
    conv: '850',
    cola: '00:01:50',
    tme: '00:00:30',
    tmo: '00:07:15',
    tma: '00:09:05',
    tmr: '00:01:10',
  },
  {
    type: 'user',
    label: 'Andrea Castrillón',
    conv: '124',
    cola: '00:01:10',
    tme: '00:00:25',
    tmo: '00:06:40',
    tma: '00:08:15',
    tmr: '00:00:55',
  },
  {
    type: 'user',
    label: 'Marcos Valenzuela',
    conv: '98',
    cola: '00:02:05',
    tme: '00:00:40',
    tmo: '00:07:55',
    tma: '00:10:10',
    tmr: '00:01:25',
  },
  {
    type: 'skill',
    label: 'Soporte Técnico Especializado',
    icon: 'support_agent',
    conv: '390',
    cola: '00:03:40',
    tme: '00:01:15',
    tmo: '00:12:30',
    tma: '00:15:20',
    tmr: '00:02:10',
  },
  {
    type: 'canal',
    label: 'Web Chat Global',
    icon: 'public',
    conv: '540',
    cola: '00:01:05',
    tme: '00:00:20',
    tmo: '00:05:40',
    tma: '00:07:05',
    tmr: '00:00:50',
  },
];

const MasterDataTable: React.FC = () => {
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
      <Flex px={6} py={4} borderBottom="1px solid" borderColor="brand.surfaceContainerHigh" justify="space-between" align="center">
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
              <Th px={6} py={4} fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" textTransform="uppercase" letterSpacing="wider">
                Estructura Jerárquica (Canal / Skill / Usuario)
              </Th>
              <Th px={4} py={4} fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" textTransform="uppercase" letterSpacing="wider" textAlign="center">
                Conv. Únicas
              </Th>
              <Th px={4} py={4} fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" textTransform="uppercase" letterSpacing="wider" textAlign="center">
                Prom T. en Cola
              </Th>
              <Th px={4} py={4} fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" textTransform="uppercase" letterSpacing="wider" textAlign="center">
                Prom. TME (Operador)
              </Th>
              <Th px={4} py={4} fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" textTransform="uppercase" letterSpacing="wider" textAlign="center">
                Prom. TMO
              </Th>
              <Th px={4} py={4} fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" textTransform="uppercase" letterSpacing="wider" textAlign="center">
                Prom. TMA
              </Th>
              <Th px={4} py={4} fontSize="xs" fontWeight="bold" color="brand.onSurfaceVariant" textTransform="uppercase" letterSpacing="wider" textAlign="center">
                Prom. TMR
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {masterData.map((row, idx) => {
              const rowProps: any = { borderBottom: "1px solid", borderColor: "blackAlpha.50" };
              let paddingLeft = "px-6";
              
              if (row.type === 'canal') {
                rowProps.bg = 'blue.50';
                rowProps._hover = { bg: 'blue.100' };
                paddingLeft = "8";
              } else if (row.type === 'skill') {
                rowProps.bg = 'gray.50';
                rowProps._hover = { bg: 'gray.100' };
                paddingLeft = "16";
              } else {
                rowProps._hover = { bg: 'gray.50' };
                paddingLeft = "24";
              }

              return (
                <Tr key={idx} {...rowProps} transition="colors 0.2s">
                  <Td px={6} py={row.type === 'canal' ? 4 : row.type === 'skill' ? 3 : 2} pl={paddingLeft}>
                    <Flex align="center" gap={3}>
                      {row.type !== 'user' && (
                        <>
                          <Box as="span" className="material-symbols-outlined" color={row.type === 'canal' ? 'blue.600' : 'gray.400'}>
                            {row.type === 'canal' ? 'chevron_right' : 'keyboard_arrow_right'}
                          </Box>
                          <Box as="span" className="material-symbols-outlined" color={row.type === 'canal' ? 'blue.600' : 'gray.400'}>
                            {row.icon}
                          </Box>
                        </>
                      )}
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
                  <Td px={4} py={row.type === 'canal' ? 4 : row.type === 'skill' ? 3 : 2} textAlign="center" fontWeight={row.type !== 'user' ? 'bold' : 'normal'} color="gray.900" fontSize={row.type === 'user' ? 'sm' : 'md'}>{row.conv}</Td>
                  <Td px={4} py={row.type === 'canal' ? 4 : row.type === 'skill' ? 3 : 2} textAlign="center" color="gray.600" fontSize="sm">{row.cola}</Td>
                  <Td px={4} py={row.type === 'canal' ? 4 : row.type === 'skill' ? 3 : 2} textAlign="center" color="gray.600" fontSize="sm">{row.tme}</Td>
                  <Td px={4} py={row.type === 'canal' ? 4 : row.type === 'skill' ? 3 : 2} textAlign="center" color="gray.600" fontSize="sm">{row.tmo}</Td>
                  <Td px={4} py={row.type === 'canal' ? 4 : row.type === 'skill' ? 3 : 2} textAlign="center" color="gray.600" fontSize="sm">{row.tma}</Td>
                  <Td px={4} py={row.type === 'canal' ? 4 : row.type === 'skill' ? 3 : 2} textAlign="center" color="gray.600" fontSize="sm">{row.tmr}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      
      <Flex px={6} py={4} bg="gray.50" borderTop="1px solid" borderColor="blackAlpha.100" justify="space-between" align="center">
        <Text fontSize="xs" color="gray.500" fontWeight="medium">Mostrando 124 registros jerárquicos</Text>
        <Flex gap={1}>
          <Button size="sm" bg="white" border="1px solid" borderColor="gray.200" fontSize="xs" fontWeight="bold">1</Button>
          <Button size="sm" variant="ghost" fontSize="xs">2</Button>
          <Button size="sm" variant="ghost" fontSize="xs">3</Button>
          <Text px={2}>...</Text>
          <Button size="sm" variant="ghost" fontSize="xs">12</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default MasterDataTable;
