/**
 * Tipos de datos que devuelve GET /api/operaciones/hoy
 */

export interface OperacionRow {
  ID_CONVERSACION: number;
  USUARIO_INICIO: string | null;
  USUARIO_FIN: string | null;
  CANAL: string | null;
  RED_SOCIAL: string | null;
  SKILL: string | null;
  CLIENTE: string | null;
  NOMBRE_CLIENTE: string | null;
  CLIENTE_NUEVO: 'SI' | 'NO';
  FECHA_HORA_PRIMER_MENSAJE_CLIENTE: string | null;
  FECHA_INGRESO_CONSOLA: string | null;
  FECHA_ASIGNACION: string | null;
  FECHA_HORA_PRIMER_MENSAJE_OPERADOR: string | null;
  FECHA_FINALIZACION: string | null;
  DURACION: string | null;
  GESTION: string | null;
  TIPO_RESOLUCION: string | null;
  RESOLUCION: string | null;
  TIEMPO_BOT: string | null;
  TIEMPO_COLA: string | null;
  TME_CLIENTE: string | null;
  TME_OPERADOR: string | null;
  TIEMPO_PRIMERA_RESPUESTA: string | null;
  TMO: string | null;
  TMA: string | null;
  TMR: string | null;
  CIE: number | null;
  CIS: number | null;
  TPIE: number | null;
  TPIS: number | null;
  OPCION_BOT: string | null;
  TIPO_CLIENTE: string | null;
  ULTIMA_ETIQUETA: string | null;
}

export interface OperacionesHoyResponse {
  success: boolean;
  fInicio: string;
  fFin: string;
  total: number;
  data: OperacionRow[];
  message?: string;
}
