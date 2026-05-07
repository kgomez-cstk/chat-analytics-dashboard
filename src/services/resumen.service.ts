/**
 * resumen.service.ts
 *
 * Lógica exclusiva para el endpoint GET /operaciones/resumen.
 * La API devuelve filas pre-agregadas por el batch (una fila por grupo de 7
 * dimensiones), a diferencia de /periodo que devuelve una fila por conversación.
 *
 * Este archivo es auto-contenido: para desactivar el modo Resumen basta con
 * eliminar este archivo y limpiar las referencias en dashboardSlice.ts y
 * FilterSection.tsx.
 */

import type {
  AdvisorRow,
  ChartDataPoint,
  LoadDistributionItem,
  MasterDataRow,
  TiemposAtencionRow,
} from '../types';

// ─── Tipos de respuesta del API ───────────────────────────────────────────────

/**
 * Una fila de DASHBOARD_OPERACIONES_RESUMEN tal como la devuelve el API.
 * Cada fila representa un grupo único (CANAL × SKILL × USUARIO × …) para
 * una empresa y fecha de proceso.
 */
export interface ResumenRow {
  FECHA_PROCESO: string;

  ID_BOT: number;
  CANAL: string | null;
  ID_RED_SOCIAL: number;
  RED_SOCIAL: string | null;
  ID_SKILL: number;
  SKILL: string | null;
  ID_USUARIO_INICIO: number;
  USUARIO_INICIO: string | null;
  TIPO_USUARIO: number;
  ID_USUARIO_FIN: number;
  USUARIO_FIN: string | null;
  ID_GESTION: number;

  // Métricas de volumen
  TOTAL_CONVERSACIONES: number;
  CLIENTES_UNICOS: number;
  TOTAL_ABANDONOS: number;
  CONV_MENORES_3MIN: number;

  // Métricas de tiempo como pares SUM + CNT (CNT = 0 ⟹ sin datos para ese grupo)
  SUM_SEG_COLA: number; CNT_COLA: number;
  SUM_SEG_TME:  number; CNT_TME:  number;
  SUM_SEG_TMO:  number; CNT_TMO:  number;
  SUM_SEG_TMA:  number; CNT_TMA:  number;
  SUM_SEG_TMR:  number; CNT_TMR:  number;
}

export interface ResumenResponse {
  success: boolean;
  fInicio: string;
  fFin: string;
  total: number;
  /** Clientes únicos reales por empresa/fecha calculados por el batch (sin filtros de dimensión). */
  clientesUnicosTotal: number;
  data: ResumenRow[];
  message?: string;
}

export interface FetchResumenParams {
  apiUrl: string;
  idEmpresa: number;
  offsetHoras: number;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string;    // YYYY-MM-DD
  tipoUsuario?: number;
  canales?: string;
  skills?: string;
  redesSociales?: string;
  gestiones?: string;
  usuariosInicio?: string;
  usuariosFin?: string;
  signal?: AbortSignal;
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchOperacionesResumen({
  apiUrl,
  idEmpresa,
  offsetHoras,
  fechaInicio,
  fechaFin,
  tipoUsuario,
  canales,
  skills,
  redesSociales,
  gestiones,
  usuariosInicio,
  usuariosFin,
  signal,
}: FetchResumenParams): Promise<ResumenResponse> {
  const qs = new URLSearchParams({
    id_empresa:   String(idEmpresa),
    fecha_inicio: fechaInicio.substring(0, 10),
    fecha_fin:    fechaFin.substring(0, 10),
    offset_horas: String(offsetHoras),
  });

  // tipo_usuario: solo enviar si es 1 (Operador) o -1 (Bot). Valor 2 = "Todos" → omitir.
  if (tipoUsuario !== undefined && tipoUsuario !== 2)
    qs.set('tipo_usuario', String(tipoUsuario));
  if (canales)        qs.set('canales',         canales);
  if (skills)         qs.set('skills',          skills);
  if (redesSociales)  qs.set('redes_sociales',  redesSociales);
  if (gestiones)      qs.set('gestiones',       gestiones);
  if (usuariosInicio) qs.set('usuarios_inicio', usuariosInicio);
  if (usuariosFin)    qs.set('usuarios_fin',    usuariosFin);

  const url = `${apiUrl}/operaciones/resumen?${qs.toString()}`;
  const response = await fetch(url, { signal });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Error ${response.status}: ${text || response.statusText}`);
  }

  const json: ResumenResponse = await response.json();
  if (!json.success) {
    throw new Error(json.message ?? 'El API devolvió success: false');
  }
  return json;
}

// ─── Colores (distribucion de carga) ─────────────────────────────────────────

const LOAD_COLORS = [
  'brand.primary',
  'brand.secondary',
  'brand.tertiary',
  'brand.primaryDim',
  'brand.secondaryDim',
];

// ─── Helpers internos ─────────────────────────────────────────────────────────

/** Convierte segundos totales → "HH:MM:SS" */
function fromSeconds(secs: number): string {
  const s = Math.round(Math.abs(secs));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, '0')).join(':');
}

/**
 * Promedio ponderado real: SUM_SEG_X / CNT_X → "HH:MM:SS".
 * Retorna '00:00:00' cuando cnt = 0 (sin datos para esa métrica en el grupo).
 */
function weightedAvg(sumSeg: number, cnt: number): string {
  if (!cnt) return '00:00:00';
  return fromSeconds(sumSeg / cnt);
}

/** Nombre corto para gráficas: "P. Apellido" */
function shortName(nombre: string): string {
  const parts = nombre.split(' ');
  return parts.length >= 2
    ? `${parts[0][0]}. ${parts[parts.length - 1]}`
    : nombre;
}

/** Iniciales para avatares (máx. 2 letras) */
function toIniciales(nombre: string): string {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

// ─── Acumulador de métricas de tiempo ────────────────────────────────────────

interface TimeAcc {
  sumCola: number; cntCola: number;
  sumTme:  number; cntTme:  number;
  sumTmo:  number; cntTmo:  number;
  sumTma:  number; cntTma:  number;
  sumTmr:  number; cntTmr:  number;
}

function emptyTimeAcc(): TimeAcc {
  return {
    sumCola: 0, cntCola: 0,
    sumTme:  0, cntTme:  0,
    sumTmo:  0, cntTmo:  0,
    sumTma:  0, cntTma:  0,
    sumTmr:  0, cntTmr:  0,
  };
}

function addTimeAcc(acc: TimeAcc, row: ResumenRow): TimeAcc {
  return {
    sumCola: acc.sumCola + row.SUM_SEG_COLA, cntCola: acc.cntCola + row.CNT_COLA,
    sumTme:  acc.sumTme  + row.SUM_SEG_TME,  cntTme:  acc.cntTme  + row.CNT_TME,
    sumTmo:  acc.sumTmo  + row.SUM_SEG_TMO,  cntTmo:  acc.cntTmo  + row.CNT_TMO,
    sumTma:  acc.sumTma  + row.SUM_SEG_TMA,  cntTma:  acc.cntTma  + row.CNT_TMA,
    sumTmr:  acc.sumTmr  + row.SUM_SEG_TMR,  cntTmr:  acc.cntTmr  + row.CNT_TMR,
  };
}

// ─── Mappers públicos ─────────────────────────────────────────────────────────

/**
 * Agrupa por USUARIO_FIN y construye AdvisorRow[] para la tabla de asesores.
 * Las métricas de volumen se suman directamente desde los campos pre-calculados.
 */
export function mapResumenToAdvisors(rows: ResumenRow[]): AdvisorRow[] {
  interface Acc { total: number; clientes: number; abandono: number; menores3Min: number; }
  const byUser = new Map<string, Acc>();

  for (const row of rows) {
    const key  = row.USUARIO_FIN ?? 'SIN ASIGNAR';
    const prev = byUser.get(key) ?? { total: 0, clientes: 0, abandono: 0, menores3Min: 0 };
    byUser.set(key, {
      total:       prev.total       + row.TOTAL_CONVERSACIONES,
      clientes:    prev.clientes    + row.CLIENTES_UNICOS,
      abandono:    prev.abandono    + row.TOTAL_ABANDONOS,
      menores3Min: prev.menores3Min + row.CONV_MENORES_3MIN,
    });
  }

  let id = 1;
  return Array.from(byUser.entries()).map(([nombre, acc]) => {
    const conRespuesta = acc.total - acc.abandono;
    return {
      id:                               id++,
      nombre,
      iniciales:                        toIniciales(nombre),
      clientesUnicos:                   acc.clientes,
      conversacionesAtendidasCerradas:  conRespuesta,
      conversacionesTotales:            acc.total,
      conversacionesConRespuesta:       conRespuesta,
      abandonoAsesor:                   acc.abandono,
      porcentajeAbandono:               acc.total > 0 ? (acc.abandono / acc.total) * 100 : 0,
      conversacionesMenores3Min:        acc.menores3Min,
      porcentajeMenores3Min:            acc.total > 0 ? (acc.menores3Min / acc.total) * 100 : 0,
      // Campos no disponibles en datos de batch
      tiempoEnLinea:      '00:00:00',
      promedioDiarioLinea: '00:00',
      tiempoEnPausa:       '00:00:00',
      promedioDiarioPausa: '00:00',
    };
  });
}

/**
 * Construye TiemposAtencionRow[] agrupado por USUARIO_FIN.
 * Los promedios de tiempo se calculan como SUM_SEG / CNT (promedio ponderado real).
 */
export function mapResumenToTiemposAtencion(rows: ResumenRow[]): TiemposAtencionRow[] {
  interface Acc { total: number; clientes: number; abandono: number; time: TimeAcc; }
  const byUser = new Map<string, Acc>();

  for (const row of rows) {
    const key  = row.USUARIO_FIN ?? 'SIN ASIGNAR';
    const prev = byUser.get(key) ?? { total: 0, clientes: 0, abandono: 0, time: emptyTimeAcc() };
    byUser.set(key, {
      total:    prev.total    + row.TOTAL_CONVERSACIONES,
      clientes: prev.clientes + row.CLIENTES_UNICOS,
      abandono: prev.abandono + row.TOTAL_ABANDONOS,
      time:     addTimeAcc(prev.time, row),
    });
  }

  let id = 1;
  return Array.from(byUser.entries()).map(([nombre, acc]) => {
    const t = acc.time;
    return {
      id:                    id++,
      nombre,
      iniciales:             toIniciales(nombre),
      clientesUnicos:        acc.clientes,
      abandonoAsesor:        acc.abandono,
      porcentajeAbandono:    acc.total > 0 ? (acc.abandono / acc.total) * 100 : 0,
      cantidadConversaciones: acc.total,
      tiempoEnCola: weightedAvg(t.sumCola, t.cntCola),
      tma:          weightedAvg(t.sumTma,  t.cntTma),
      tmeOperador:  weightedAvg(t.sumTme,  t.cntTme),
      tmo:          weightedAvg(t.sumTmo,  t.cntTmo),
      tmr:          weightedAvg(t.sumTmr,  t.cntTmr),
    };
  });
}

/**
 * Construye la jerarquía Canal → Skill → Usuario para la Tabla Maestra.
 * Los tiempos se agregan como promedios ponderados (SUM/CNT por nivel).
 */
export function mapResumenToMasterData(rows: ResumenRow[]): MasterDataRow[] {
  interface Group { conv: number; clientes: number; time: TimeAcc; }
  type SkillMap  = Map<string, { g: Group; users: Map<string, Group> }>;
  type CanalMap  = Map<string, { g: Group; skills: SkillMap }>;

  const byCanal: CanalMap = new Map();

  for (const row of rows) {
    const canal = row.CANAL       ?? 'SIN CANAL';
    const skill = row.SKILL       ?? 'SIN SKILL';
    const user  = row.USUARIO_FIN ?? 'SIN ASIGNAR';

    if (!byCanal.has(canal)) byCanal.set(canal, { g: { conv: 0, clientes: 0, time: emptyTimeAcc() }, skills: new Map() });
    const ce = byCanal.get(canal)!;

    if (!ce.skills.has(skill)) ce.skills.set(skill, { g: { conv: 0, clientes: 0, time: emptyTimeAcc() }, users: new Map() });
    const se = ce.skills.get(skill)!;

    if (!se.users.has(user)) se.users.set(user, { conv: 0, clientes: 0, time: emptyTimeAcc() });
    const ue = se.users.get(user)!;

    // Acumular en los tres niveles
    ue.conv     += row.TOTAL_CONVERSACIONES; ue.clientes += row.CLIENTES_UNICOS; ue.time = addTimeAcc(ue.time, row);
    se.g.conv   += row.TOTAL_CONVERSACIONES; se.g.clientes += row.CLIENTES_UNICOS; se.g.time = addTimeAcc(se.g.time, row);
    ce.g.conv   += row.TOTAL_CONVERSACIONES; ce.g.clientes += row.CLIENTES_UNICOS; ce.g.time = addTimeAcc(ce.g.time, row);
  }

  const result: MasterDataRow[] = [];

  for (const [canal, ce] of byCanal.entries()) {
    const ct = ce.g.time;
    result.push({
      type: 'canal', label: canal, icon: 'chat',
      conv: ce.g.conv, clientes: ce.g.clientes,
      cola: weightedAvg(ct.sumCola, ct.cntCola),
      tme:  weightedAvg(ct.sumTme,  ct.cntTme),
      tmo:  weightedAvg(ct.sumTmo,  ct.cntTmo),
      tma:  weightedAvg(ct.sumTma,  ct.cntTma),
      tmr:  weightedAvg(ct.sumTmr,  ct.cntTmr),
    });

    for (const [skill, se] of ce.skills.entries()) {
      const st = se.g.time;
      result.push({
        type: 'skill', label: skill, icon: 'build',
        conv: se.g.conv, clientes: se.g.clientes,
        cola: weightedAvg(st.sumCola, st.cntCola),
        tme:  weightedAvg(st.sumTme,  st.cntTme),
        tmo:  weightedAvg(st.sumTmo,  st.cntTmo),
        tma:  weightedAvg(st.sumTma,  st.cntTma),
        tmr:  weightedAvg(st.sumTmr,  st.cntTmr),
      });

      for (const [user, ue] of se.users.entries()) {
        const ut = ue.time;
        result.push({
          type: 'user', label: user,
          conv: ue.conv, clientes: ue.clientes,
          cola: weightedAvg(ut.sumCola, ut.cntCola),
          tme:  weightedAvg(ut.sumTme,  ut.cntTme),
          tmo:  weightedAvg(ut.sumTmo,  ut.cntTmo),
          tma:  weightedAvg(ut.sumTma,  ut.cntTma),
          tmr:  weightedAvg(ut.sumTmr,  ut.cntTmr),
        });
      }
    }
  }

  return result;
}

/**
 * Construye LoadDistributionItem[] con porcentaje de conversaciones por USUARIO_FIN.
 */
export function mapResumenToLoadDistribution(rows: ResumenRow[]): LoadDistributionItem[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const user = row.USUARIO_FIN ?? 'SIN ASIGNAR';
    counts.set(user, (counts.get(user) ?? 0) + row.TOTAL_CONVERSACIONES);
  }
  if (counts.size === 0) return [];

  // Total global (todos los usuarios) para que el % refleje participación real
  const totalGlobal = Array.from(counts.values()).reduce((a, b) => a + b, 0);
  const top10 = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return top10.map(([nombre, count], idx) => ({
    nombre,
    shortName:  shortName(nombre),
    porcentaje: Math.round((count / totalGlobal) * 100),
    color:      LOAD_COLORS[idx % LOAD_COLORS.length],
  }));
}

/**
 * Construye ChartDataPoint[] con conversaciones totales por USUARIO_FIN (gráfico de barras).
 */
export function mapResumenToChartData(rows: ResumenRow[]): ChartDataPoint[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const user = row.USUARIO_FIN ?? 'SIN ASIGNAR';
    counts.set(user, (counts.get(user) ?? 0) + row.TOTAL_CONVERSACIONES);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([nombre, count]) => ({ name: shortName(nombre), value: count }));
}
