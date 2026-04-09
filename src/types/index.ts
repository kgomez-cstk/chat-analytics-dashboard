// ─── Shared Types ───

export interface UserData {
  id_usuario: number;
  nombre: string;
  apellido: string;
  rol: string;
  token: string;
  id_empresa: number;
  nombre_empresa: string;
  app_name: string;
  favicon_url: string;
  offset_horas: number;
  permisos: string[];
  elmtPaginado?: number;
}

export interface AdvisorRow {
  id: number;
  nombre: string;
  iniciales: string;
  clientesUnicos: number;                    // NEW
  conversacionesAtendidasCerradas: number;
  conversacionesTotales: number;
  conversacionesConRespuesta: number;        // NEW
  abandonoAsesor: number;                    // NEW
  porcentajeAbandono: number;                // NEW
  conversacionesMenores3Min: number;
  porcentajeMenores3Min: number;
  tiempoEnLinea: string;
  promedioDiarioLinea: string;
  tiempoEnPausa: string;
  promedioDiarioPausa: string;
}

export interface TiemposAtencionRow {
  id: number;
  nombre: string;
  iniciales: string;
  clientesUnicos: number;
  cantidadConversaciones: number;
  tiempoEnCola: string;
  tma: string;
  tmeOperador: string;
  tmo: string;
  tmr: string;
}

export interface FilterOption {
  value: string | number;
  label: string;
}

export interface FilterState {
  canal: FilterOption[];
  skills: FilterOption[];
  tipoUsuario: FilterOption[];
  redSocial: FilterOption[];
  gestiones: FilterOption[];
  usuarioInicia: FilterOption[];
  usuarioFinaliza: FilterOption[];
  fechaInicio: string;
  fechaFin: string;
  dateMode: 'datetime' | 'dateonly';
}

export interface SLAMetric {
  label: string;
  value: number | string;
  trend: number;
  trendLabel: string;
  trendDirection: 'up' | 'down' | 'neutral';
  borderColor: string;
  icon: string;
}

export interface Conversation {
  id: number;
  asesor: string;
  cliente: string;
  canal: string;
  estado: string;
  duracion: number;
  fechaInicio: string;
  fechaFin: string;
  redSocial: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

export interface PostMessagePayload {
  type: 'INIT' | 'CLOSE_DASH';
  data?: UserData | string;
}

export interface LoadDistributionItem {
  nombre: string;
  shortName: string;
  porcentaje: number;
  color: string;
}

export interface DashboardState {
  metrics: SLAMetric[];
  advisors: AdvisorRow[];
  tiemposAtencion: TiemposAtencionRow[];
  conversations: Conversation[];
  chartData: ChartDataPoint[];
  loadDistribution: LoadDistributionItem[];
  isLoading: boolean;
  error: string | null;
}
