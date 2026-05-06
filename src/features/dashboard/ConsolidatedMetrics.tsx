import React from 'react';
import {
  SimpleGrid,
  Box,
  Text,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  MdChatBubble,
  MdPersonSearch,
  MdSpeed,
  MdTimer,
  MdAccessTime
} from 'react-icons/md';
import { useAppSelector } from '../../hooks/useRedux';

const MotionBox = motion.create(Box);

const timeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : 0;
};

const secondsToTime = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds <= 0) return '00:00:00';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const ConsolidatedMetrics: React.FC = () => {
  const advisors            = useAppSelector((state) => state.dashboard.advisors);
  const tiemposAtencion     = useAppSelector((state) => state.dashboard.tiemposAtencion);
  // null → datos de /hoy o /periodo (suma desde advisors)
  // number → datos de /resumen (ya resuelto en el thunk según filtros activos)
  const clientesUnicosGlobal = useAppSelector((state) => state.dashboard.clientesUnicosGlobal);

  const stats = React.useMemo(() => {
    // Basic sums from advisors
    const basicStats = advisors.reduce(
      (acc, curr) => ({
        totales: acc.totales + curr.conversacionesTotales,
        conRespuesta: acc.conRespuesta + curr.conversacionesConRespuesta,
        abandono: acc.abandono + curr.abandonoAsesor,
        clientes: acc.clientes + curr.clientesUnicos,
      }),
      { totales: 0, conRespuesta: 0, abandono: 0, clientes: 0 }
    );

    // Clientes únicos: si venimos de /resumen el thunk ya eligió la fuente correcta
    // (batch para sin filtros, suma por grupo para con filtros).
    // Para /hoy y /periodo se usa la suma desde advisors como siempre.
    const clientesUnicos = clientesUnicosGlobal ?? basicStats.clientes;

    // Percentage Calculation
    const pctAbandono = basicStats.totales > 0
      ? ((basicStats.abandono / basicStats.totales) * 100).toFixed(1) + '%'
      : '0.0%';

    // Averages from tiemposAtencion
    const timeSums = tiemposAtencion.reduce(
      (acc, curr) => ({
        cola: acc.cola + timeToSeconds(curr.tiempoEnCola),
        tmo: acc.tmo + timeToSeconds(curr.tmo),
        tma: acc.tma + timeToSeconds(curr.tma),
        tme: acc.tme + timeToSeconds(curr.tmeOperador),
        tmr: acc.tmr + timeToSeconds(curr.tmr),
      }),
      { cola: 0, tmo: 0, tma: 0, tme: 0, tmr: 0 }
    );

    const count = tiemposAtencion.length || 1;

    return [
      { label: 'Total Conversaciones', value: basicStats.totales.toLocaleString(), icon: MdChatBubble, color: 'brand.primary' },
      { label: 'Conversaciones con Respuesta', value: basicStats.conRespuesta.toLocaleString(), icon: MdChatBubble, color: 'brand.secondary' },
      { label: 'Abandono Asesor', value: basicStats.abandono.toLocaleString(), icon: MdChatBubble, color: 'brand.error' },
      { label: '% Abandono', value: pctAbandono, icon: MdSpeed, color: 'brand.error' },
      { label: 'Clientes Únicos', value: clientesUnicos.toLocaleString(), icon: MdPersonSearch, color: 'brand.tertiary' },
      { label: 'Tiempo en Cola', value: secondsToTime(timeSums.cola / count), icon: MdAccessTime, color: 'brand.primaryDim' },
      { label: 'TMO', value: secondsToTime(timeSums.tmo / count), icon: MdSpeed, color: 'brand.secondary' },
      { label: 'TMA', value: secondsToTime(timeSums.tma / count), icon: MdAccessTime, color: 'brand.primary' },
      { label: 'TME Operador', value: secondsToTime(timeSums.tme / count), icon: MdTimer, color: 'brand.tertiary' },
      { label: 'TMR', value: secondsToTime(timeSums.tmr / count), icon: MdTimer, color: 'brand.secondaryDim' },
    ];
  }, [advisors, tiemposAtencion, clientesUnicosGlobal]);

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} spacing={2} mb={6}>
      {stats.map((stat, index) => (
        <MotionBox
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          bg="brand.surfaceContainerLowest"
          py={1.5}
          px={2.5}
          rounded="lg"
          borderLeft="2.5px solid"
          borderColor={stat.color}
          shadow="sm"
          position="relative"
          overflow="hidden"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          minH="62px"
        >
          {/* Subtle background icon */}
          <Icon
            as={stat.icon}
            position="absolute"
            right="6px"
            top="6px"
            fontSize="2xl"
            opacity={0.04}
          />

          <Text
            fontSize="10px"
            fontWeight="bold"
            color="brand.onSurfaceVariant"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={0}
            noOfLines={1}
          >
            {stat.label}
          </Text>
          <Text
            fontFamily="heading"
            fontSize="lg"
            fontWeight="bold"
            color="brand.onSurface"
            lineHeight="1.1"
            mt={0.5}
          >
            {stat.value}
          </Text>
        </MotionBox>
      ))}
    </SimpleGrid>
  );
};

export default ConsolidatedMetrics;
