import type { AdvisorRow, TiemposAtencionRow, SLAMetric, ChartDataPoint, LoadDistributionItem, FilterOption } from '../types';

export const USE_MOCK = true;

// ─── Filter Options ───

export const canalOptions: FilterOption[] = [
  { value: 'all', label: 'Todos los Canales' },
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
];

export const skillOptions: FilterOption[] = [
  { value: 'soporte', label: 'Soporte' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'cobranza', label: 'Cobranza' },
  { value: 'retencion', label: 'Retención' },
];

export const tipoUsuarioOptions: FilterOption[] = [
  { value: 'asesor', label: 'Asesor' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'admin', label: 'Administrador' },
];

export const redSocialOptions: FilterOption[] = [
  { value: 1, label: 'WhatsApp' },
  { value: 2, label: 'Facebook Messenger' },
  { value: 3, label: 'Instagram' },
  { value: 4, label: 'Telegram' },
  { value: 5, label: 'Web Chat' },
];

export const gestionOptions: FilterOption[] = [
  { value: 'info', label: 'Información General' },
  { value: 'quejas', label: 'Quejas' },
  { value: 'pagos', label: 'Pagos' },
  { value: 'bajas', label: 'Bajas' },
];

export const usuarioIniciaOptions: FilterOption[] = [
  { value: 'u1', label: 'Carlos Mendoza' },
  { value: 'u2', label: 'Lucia Torres' },
];

export const usuarioFinalizaOptions: FilterOption[] = [
  { value: 'u3', label: 'Marta Gomez' },
  { value: 'u4', label: 'Jorge Ruiz' },
];

// ─── Mock Metrics ───

export const mockMetrics: SLAMetric[] = [
  {
    label: 'Total Conversaciones',
    value: '1,248',
    trend: 12,
    trendLabel: '12% vs mes anterior',
    trendDirection: 'up',
    borderColor: 'brand.primary',
    icon: 'chat_bubble',
  },
  {
    label: 'Conversaciones Únicas',
    value: '856',
    trend: 0,
    trendLabel: '68.5% ratio de recurrencia',
    trendDirection: 'neutral',
    borderColor: 'brand.secondary',
    icon: 'person_search',
  },
  {
    label: '% Performance General',
    value: '64.2%',
    trend: -4,
    trendLabel: '-4% bajo el target (70%)',
    trendDirection: 'down',
    borderColor: 'brand.error',
    icon: 'speed',
  },
];

// ─── Mock Advisors ───
export const mockAdvisors: AdvisorRow[] = [
  {
    id: 1,
    nombre: 'Luis Alfredo Miranda',
    iniciales: 'LM',
    conversacionesAtendidasCerradas: 108,
    conversacionesTotales: 144,
    conversacionesMenores3Min: 113,
    porcentajeMenores3Min: 78.47,
    tiempoEnLinea: '08:45:20',
    promedioDiarioLinea: '08:15',
    tiempoEnPausa: '00:45:10',
    promedioDiarioPausa: '00:42',
  },
  {
    id: 2,
    nombre: 'Alejandro Enrique Rivas',
    iniciales: 'AR',
    conversacionesAtendidasCerradas: 114,
    conversacionesTotales: 181,
    conversacionesMenores3Min: 120,
    porcentajeMenores3Min: 66.30,
    tiempoEnLinea: '07:30:15',
    promedioDiarioLinea: '07:05',
    tiempoEnPausa: '01:15:30',
    promedioDiarioPausa: '01:10',
  },
  {
    id: 3,
    nombre: 'Maria Alejandra Rodriguez',
    iniciales: 'MR',
    conversacionesAtendidasCerradas: 147,
    conversacionesTotales: 252,
    conversacionesMenores3Min: 145,
    porcentajeMenores3Min: 57.54,
    tiempoEnLinea: '09:12:45',
    promedioDiarioLinea: '08:50',
    tiempoEnPausa: '00:30:15',
    promedioDiarioPausa: '00:28',
  },
  {
    id: 4,
    nombre: 'Carlos Eduardo Gonzalez',
    iniciales: 'CG',
    conversacionesAtendidasCerradas: 102,
    conversacionesTotales: 160,
    conversacionesMenores3Min: 102,
    porcentajeMenores3Min: 63.75,
    tiempoEnLinea: '08:05:10',
    promedioDiarioLinea: '07:45',
    tiempoEnPausa: '00:50:20',
    promedioDiarioPausa: '00:48',
  },
  {
    id: 5,
    nombre: 'Sofia Valentina Vargas',
    iniciales: 'SV',
    conversacionesAtendidasCerradas: 89,
    conversacionesTotales: 110,
    conversacionesMenores3Min: 92,
    porcentajeMenores3Min: 83.64,
    tiempoEnLinea: '06:55:40',
    promedioDiarioLinea: '06:30',
    tiempoEnPausa: '00:20:10',
    promedioDiarioPausa: '00:18',
  },
];

// ─── Mock Load Distribution ───

export const mockLoadDistribution: LoadDistributionItem[] = [
  { nombre: 'Luis Alfredo Miranda', shortName: 'L. Miranda', porcentaje: 17, color: 'brand.primary' },
  { nombre: 'Alejandro Enrique Rivas', shortName: 'A. Rivas', porcentaje: 21, color: 'brand.secondary' },
  { nombre: 'Maria Alejandra Rodriguez', shortName: 'M. Rodriguez', porcentaje: 30, color: 'brand.tertiary' },
  { nombre: 'Carlos Eduardo Gonzalez', shortName: 'C. Gonzalez', porcentaje: 19, color: 'brand.primaryDim' },
  { nombre: 'Sofia Valentina Vargas', shortName: 'S. Vargas', porcentaje: 13, color: 'brand.secondaryDim' },
];

// ─── Mock Chart Data ───

export const mockBarChartData: ChartDataPoint[] = [
  { name: 'L. Miranda', value: 144 },
  { name: 'A. Rivas', value: 181 },
  { name: 'M. Rodriguez', value: 252 },
  { name: 'C. Gonzalez', value: 160 },
  { name: 'S. Vargas', value: 110 },
];

export const mockLineChartData: ChartDataPoint[] = [
  { name: 'Sem 1', value: 280 },
  { name: 'Sem 2', value: 310 },
  { name: 'Sem 3', value: 340 },
  { name: 'Sem 4', value: 318 },
];

export const mockPieChartData: ChartDataPoint[] = [
  { name: 'WhatsApp', value: 856, fill: '#0053db' },
  { name: 'Messenger', value: 210, fill: '#742fe5' },
  { name: 'Instagram', value: 120, fill: '#006b62' },
  { name: 'Web Chat', value: 62, fill: '#0048c1' },
];

export const mockTiemposAtencion: TiemposAtencionRow[] = [
  { id: 1, nombre: 'Luis Alfredo Miranda Orozco', iniciales: 'LM', clientesUnicos: 85, cantidadConversaciones: 124, tiempoEnCola: '00:04:15', tma: '00:51:39', tmeOperador: '00:22:50', tmo: '00:36:40', tmr: '00:45:10' },
  { id: 2, nombre: 'Alejandro Enrique Rivas Mendez', iniciales: 'AR', clientesUnicos: 92, cantidadConversaciones: 145, tiempoEnCola: '00:03:20', tma: '06:38:10', tmeOperador: '00:11:59', tmo: '00:36:17', tmr: '00:15:30' },
  { id: 3, nombre: 'Amidia Leticia Rivas Torres', iniciales: 'AT', clientesUnicos: 78, cantidadConversaciones: 112, tiempoEnCola: '00:05:45', tma: '01:27:22', tmeOperador: '00:18:52', tmo: '00:27:41', tmr: '00:30:15' },
  { id: 4, nombre: 'Ana Nohemy Lopez Cordero', iniciales: 'AL', clientesUnicos: 64, cantidadConversaciones: 98, tiempoEnCola: '00:02:10', tma: '01:42:40', tmeOperador: '00:45:14', tmo: '01:09:23', tmr: '00:50:20' },
  { id: 5, nombre: 'Andrea Nicole Mejia Hurtado', iniciales: 'AM', clientesUnicos: 105, cantidadConversaciones: 156, tiempoEnCola: '00:06:30', tma: '01:06:24', tmeOperador: '00:27:50', tmo: '00:29:01', tmr: '00:20:10' },
  { id: 6, nombre: 'Franchesculi Rafaelo Samayoa', iniciales: 'FS', clientesUnicos: 55, cantidadConversaciones: 82, tiempoEnCola: '00:01:50', tma: '00:40:13', tmeOperador: '00:07:21', tmo: '00:26:01', tmr: '00:12:45' },
  { id: 7, nombre: 'Jennifer Michelle Campos Ayala', iniciales: 'JC', clientesUnicos: 88, cantidadConversaciones: 130, tiempoEnCola: '00:04:40', tma: '01:17:13', tmeOperador: '00:22:09', tmo: '00:26:39', tmr: '00:25:00' },
  { id: 8, nombre: 'Jennifer Sofia Hernandez Sánchez', iniciales: 'JH', clientesUnicos: 72, cantidadConversaciones: 105, tiempoEnCola: '00:03:15', tma: '01:57:14', tmeOperador: '00:36:07', tmo: '00:43:53', tmr: '00:40:12' },
  { id: 9, nombre: 'Jonathan Bladimir Linares Ardon', iniciales: 'JL', clientesUnicos: 95, cantidadConversaciones: 140, tiempoEnCola: '00:05:00', tma: '02:09:52', tmeOperador: '00:09:15', tmo: '00:39:00', tmr: '00:18:30' },
  { id: 10, nombre: 'Julio Cesar Hernandez Servellon', iniciales: 'JH', clientesUnicos: 80, cantidadConversaciones: 118, tiempoEnCola: '00:02:40', tma: '01:26:10', tmeOperador: '00:03:51', tmo: '00:57:16', tmr: '00:12:05' },
];
