// ─── Shared Types ───

export interface UserData {
  id_usuario: number;
  nombre?: string;
  apellido?: string;
  nombre_usuario?: string;
  rol?: string;
  token?: string;
  id_empresa?: number;
  nombre_empresa?: string;
  app_name: string;
  favicon_url: string;
  offset_horas: number;
  permisos: string[];
  elmtPaginado?: number;
  elementosPagina?: number;
  url_api?: string;
  urlLogoHeader?: string;
  apiToken?: string;
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
  abandonoAsesor: number;
  porcentajeAbandono: number;
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
  queryMode: 'today' | 'range';
  /** Solo aplica cuando queryMode === 'range': fuente del endpoint a consultar. */
  periodoSource: 'periodo' | 'resumen';
  /** true cuando el usuario modificó explícitamente la selección de red social desde el default (WhatsApp). */
  redSocialModificado: boolean;
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

export interface MasterDataRow {
  type: 'canal' | 'skill' | 'user';
  label: string;
  icon?: string;
  conv: number;
  clientes: number;
  cola: string;
  tme: string;
  tmo: string;
  tma: string;
  tmr: string;
}

export interface DashboardState {
  metrics: SLAMetric[];
  advisors: AdvisorRow[];
  tiemposAtencion: TiemposAtencionRow[];
  masterData: MasterDataRow[];
  conversations: Conversation[];
  chartData: ChartDataPoint[];
  loadDistribution: LoadDistributionItem[];
  /**
   * Clientes únicos globales para usar en ConsolidatedMetrics.
   * - null  → datos de /hoy o /periodo; usar suma desde advisors (comportamiento actual)
   * - number → datos de /resumen; valor ya resuelto en el thunk según filtros activos
   */
  clientesUnicosGlobal: number | null;
  isLoading: boolean;
  error: string | null;
}
