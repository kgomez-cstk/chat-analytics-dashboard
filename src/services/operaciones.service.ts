import type {
  AdvisorRow,
  ChartDataPoint,
  FilterOption,
  LoadDistributionItem,
  MasterDataRow,
} from '../types';
import type { OperacionesHoyResponse, OperacionRow } from './operaciones.types';

export interface FetchOperacionesParams {
  apiUrl:        string;
  idEmpresa:     number;
  offsetHoras:   number;
  queryMode?:    'today' | 'range';
  fechaInicio?:  string; // YYYY-MM-DD
  fechaFin?:     string; // YYYY-MM-DD
  // Filtros opcionales — omitir = "Todos" para ese filtro
  tipoUsuario?:    number;   // 1=Operador, -1=Bot/IVR; omitir=Todos (no enviar si valor=2)
  canales?:        string;   // IDs de BOT separados por coma
  skills?:         string;   // IDs de SKILL separados por coma
  redesSociales?:  string;   // IDs de RED_SOCIAL separados por coma
  gestiones?:      string;   // IDs de TIPO_GESTION separados por coma
  usuariosInicio?: string;   // IDs de ID_USUARIO_INICIO separados por coma
  usuariosFin?:    string;   // IDs de ID_USUARIO (fin) separados por coma
  signal?:         AbortSignal;
}

export async function fetchOperacionesHoy({
  apiUrl,
  idEmpresa,
  offsetHoras,
  queryMode = 'today',
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
}: FetchOperacionesParams): Promise<OperacionesHoyResponse> {
  const qs = new URLSearchParams({
    id_empresa:   String(idEmpresa),
  });

  let endpoint = '/api/operaciones/hoy';

  if (queryMode === 'range' && fechaInicio && fechaFin) {
    endpoint = '/api/operaciones/periodo';
    qs.set('fecha_inicio', fechaInicio.substring(0, 10));
    qs.set('fecha_fin', fechaFin.substring(0, 10));
  } else {
    qs.set('offset_horas', String(offsetHoras));
  }

  // tipo_usuario: solo enviar si es 1 (Operador) o -1 (Bot). Valor 2 = "Todos" → omitir.
  if (tipoUsuario !== undefined && tipoUsuario !== 2)
    qs.set('tipo_usuario',    String(tipoUsuario));
  if (canales)        qs.set('canales',          canales);
  if (skills)         qs.set('skills',           skills);
  if (redesSociales)  qs.set('redes_sociales',   redesSociales);
  if (gestiones)      qs.set('gestiones',        gestiones);
  if (usuariosInicio) qs.set('usuarios_inicio',  usuariosInicio);
  if (usuariosFin)    qs.set('usuarios_fin',     usuariosFin);

  const url = `${apiUrl}${endpoint}?${qs.toString()}`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Error ${response.status}: ${text || response.statusText}`);
  }

  const json: OperacionesHoyResponse = await response.json();

  if (!json.success) {
    throw new Error(json.message ?? 'El API devolvió success: false');
  }

  return json;
}

// ─── Helper de abandono ───────────────────────────────────────────────────────

/**
 * Devuelve true si la conversación fue ABANDONADA por el asesor,
 * es decir, no existe FECHA_HORA_PRIMER_MENSAJE_OPERADOR (null, undefined o "").
 * Definición:
 *   Abandono asesor  → cantidad de conversaciones sin respuesta del operador
 *   % Abandono       → abandonoAsesor / cantidadConversaciones * 100
 */
const esAbandonada = (r: OperacionRow): boolean =>
  !r.FECHA_HORA_PRIMER_MENSAJE_OPERADOR;

// ─── Colores para distribución de carga ──────────────────────────────────────

const LOAD_COLORS = [
  'brand.primary',
  'brand.secondary',
  'brand.tertiary',
  'brand.primaryDim',
  'brand.secondaryDim',
];

// ─── Funciones de mapeo principales ──────────────────────────────────────────

/**
 * Agrupa por USUARIO_FIN y construye AdvisorRow[] para la tabla de asesores.
 * Los campos de tiempo en línea/pausa no están disponibles en este endpoint
 * y se devuelven como '00:00:00' / '00:00'.
 */
export function mapToAdvisors(rows: OperacionRow[]): AdvisorRow[] {
  const byUser = new Map<string, OperacionRow[]>();

  for (const row of rows) {
    const key = row.USUARIO_FIN ?? 'SIN ASIGNAR';
    if (!byUser.has(key)) byUser.set(key, []);
    byUser.get(key)!.push(row);
  }

  let id = 1;
  return Array.from(byUser.entries()).map(([nombre, userRows]) => {
    const total         = userRows.length;
    const clientesUnicos = new Set(userRows.map((r) => r.CLIENTE)).size;
    // Abandono = conversaciones sin respuesta del operador (sin FECHA_HORA_PRIMER_MENSAJE_OPERADOR)
    const abandono      = userRows.filter(esAbandonada).length;
    const conRespuesta  = total - abandono;
    const menores3Min   = userRows.filter(
      (r) => toSeconds(r.TMA) > 0 && toSeconds(r.TMA) < 180
    ).length;

    return {
      id: id++,
      nombre,
      iniciales: nombre
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0] ?? '')
        .join('')
        .toUpperCase(),
      clientesUnicos,
      conversacionesAtendidasCerradas: conRespuesta,
      conversacionesTotales: total,
      conversacionesConRespuesta: conRespuesta,
      abandonoAsesor: abandono,
      porcentajeAbandono: total > 0 ? (abandono / total) * 100 : 0,
      conversacionesMenores3Min: menores3Min,
      porcentajeMenores3Min: total > 0 ? (menores3Min / total) * 100 : 0,
      tiempoEnLinea: '00:00:00',
      promedioDiarioLinea: '00:00',
      tiempoEnPausa: '00:00:00',
      promedioDiarioPausa: '00:00',
    };
  });
}

/**
 * Construye la estructura jerárquica Canal → Skill → Usuario para la Tabla Maestra.
 * Devuelve un array plano con propiedad 'type' para indicar el nivel.
 */
export function mapToMasterData(rows: OperacionRow[]): MasterDataRow[] {
  const result: MasterDataRow[] = [];

  const byCanal = new Map<string, OperacionRow[]>();
  for (const row of rows) {
    const canal = row.CANAL ?? 'SIN CANAL';
    if (!byCanal.has(canal)) byCanal.set(canal, []);
    byCanal.get(canal)!.push(row);
  }

  for (const [canal, canalRows] of byCanal.entries()) {
    result.push({
      type: 'canal',
      label: canal,
      icon: 'chat',
      conv: canalRows.length,
      clientes: new Set(canalRows.map((r) => r.CLIENTE)).size,
      cola: avgHHMMSS(canalRows.map((r) => r.TIEMPO_COLA)),
      tme: avgHHMMSS(canalRows.map((r) => r.TME_OPERADOR)),
      tmo: avgHHMMSS(canalRows.map((r) => r.TMO)),
      tma: avgHHMMSS(canalRows.map((r) => r.TMA)),
      tmr: avgHHMMSS(canalRows.map((r) => r.TMR)),
    });

    const bySkill = new Map<string, OperacionRow[]>();
    for (const row of canalRows) {
      const skill = row.SKILL ?? 'SIN SKILL';
      if (!bySkill.has(skill)) bySkill.set(skill, []);
      bySkill.get(skill)!.push(row);
    }

    for (const [skill, skillRows] of bySkill.entries()) {
      result.push({
        type: 'skill',
        label: skill,
        icon: 'build',
        conv: skillRows.length,
        clientes: new Set(skillRows.map((r) => r.CLIENTE)).size,
        cola: avgHHMMSS(skillRows.map((r) => r.TIEMPO_COLA)),
        tme: avgHHMMSS(skillRows.map((r) => r.TME_OPERADOR)),
        tmo: avgHHMMSS(skillRows.map((r) => r.TMO)),
        tma: avgHHMMSS(skillRows.map((r) => r.TMA)),
        tmr: avgHHMMSS(skillRows.map((r) => r.TMR)),
      });

      const byUser = new Map<string, OperacionRow[]>();
      for (const row of skillRows) {
        const user = row.USUARIO_FIN ?? 'SIN ASIGNAR';
        if (!byUser.has(user)) byUser.set(user, []);
        byUser.get(user)!.push(row);
      }

      for (const [user, userRows] of byUser.entries()) {
        result.push({
          type: 'user',
          label: user,
          conv: userRows.length,
          clientes: new Set(userRows.map((r) => r.CLIENTE)).size,
          cola: avgHHMMSS(userRows.map((r) => r.TIEMPO_COLA)),
          tme: avgHHMMSS(userRows.map((r) => r.TME_OPERADOR)),
          tmo: avgHHMMSS(userRows.map((r) => r.TMO)),
          tma: avgHHMMSS(userRows.map((r) => r.TMA)),
          tmr: avgHHMMSS(userRows.map((r) => r.TMR)),
        });
      }
    }
  }

  return result;
}

/**
 * Construye LoadDistributionItem[] con porcentaje de conversaciones por asesor.
 * Los porcentajes se ajustan para sumar exactamente 100.
 */
export function mapToLoadDistribution(rows: OperacionRow[]): LoadDistributionItem[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const user = row.USUARIO_FIN ?? 'SIN ASIGNAR';
    counts.set(user, (counts.get(user) ?? 0) + 1);
  }

  if (counts.size === 0) return [];

  const total = rows.length;
  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);

  let remaining = 100;
  return sorted.map(([nombre, count], idx) => {
    const isLast = idx === sorted.length - 1;
    const pct = isLast ? remaining : Math.round((count / total) * 100);
    remaining -= pct;

    const parts = nombre.split(' ');
    const shortName =
      parts.length >= 2
        ? `${parts[0][0]}. ${parts[parts.length - 1]}`
        : nombre;

    return {
      nombre,
      shortName,
      porcentaje: pct,
      color: LOAD_COLORS[idx % LOAD_COLORS.length],
    };
  });
}

/**
 * Construye ChartDataPoint[] con total de conversaciones por asesor (para gráfico de barras).
 */
export function mapToChartData(rows: OperacionRow[]): ChartDataPoint[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const user = row.USUARIO_FIN ?? 'SIN ASIGNAR';
    counts.set(user, (counts.get(user) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([nombre, count]) => {
      const parts = nombre.split(' ');
      const shortName =
        parts.length >= 2
          ? `${parts[0][0]}. ${parts[parts.length - 1]}`
          : nombre;
      return { name: shortName, value: count };
    });
}

/**
 * Extrae valores únicos de las columnas relevantes de OperacionRow[]
 * para poblar dinámicamente los selectores de filtro.
 */
export function mapToFilterOptions(rows: OperacionRow[]): FilterOptions {
  const toOpts = (vals: (string | null)[]): FilterOption[] =>
    [...new Set(vals.filter(Boolean) as string[])]
      .sort()
      .map((v) => ({ value: v, label: v }));

  return {
    canal: toOpts(rows.map((r) => r.CANAL)),
    skills: toOpts(rows.map((r) => r.SKILL)),
    redSocial: toOpts(rows.map((r) => r.RED_SOCIAL)),
    gestiones: toOpts(rows.map((r) => r.GESTION)),
    usuarioInicia: toOpts(rows.map((r) => r.USUARIO_INICIO)),
    usuarioFinaliza: toOpts(rows.map((r) => r.USUARIO_FIN)),
  };
}

/**
 * Agrupa por USUARIO_FIN y calcula métricas de tiempos para TiemposAtencionTable.
 */
export function mapToTiemposAtencion(rows: OperacionRow[]) {
  const byUser = new Map<string, OperacionRow[]>();

  for (const row of rows) {
    const key = row.USUARIO_FIN ?? 'SIN ASIGNAR';
    if (!byUser.has(key)) byUser.set(key, []);
    byUser.get(key)!.push(row);
  }

  let id = 1;
  return Array.from(byUser.entries()).map(([nombre, userRows]) => {
    const clientesUnicos         = new Set(userRows.map((r) => r.CLIENTE)).size;
    const cantidadConversaciones = userRows.length;
    // Abandono = conversaciones sin respuesta del operador (sin FECHA_HORA_PRIMER_MENSAJE_OPERADOR)
    const abandono               = userRows.filter(esAbandonada).length;

    return {
      id: id++,
      nombre,
      iniciales: nombre
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0] ?? '')
        .join('')
        .toUpperCase(),
      clientesUnicos,
      abandonoAsesor: abandono,
      porcentajeAbandono:
        cantidadConversaciones > 0
          ? (abandono / cantidadConversaciones) * 100
          : 0,
      cantidadConversaciones,
      tiempoEnCola: avgHHMMSS(userRows.map((r) => r.TIEMPO_COLA)),
      tma: avgHHMMSS(userRows.map((r) => r.TMA)),
      tmeOperador: avgHHMMSS(userRows.map((r) => r.TME_OPERADOR)),
      tmo: avgHHMMSS(userRows.map((r) => r.TMO)),
      tmr: avgHHMMSS(userRows.map((r) => r.TMR)),
    };
  });
}

// ─── Utilidades internas ──────────────────────────────────────────────────────

/** Convierte "HH:MM:SS" → segundos */
function toSeconds(hhmmss: string | null): number {
  if (!hhmmss) return 0;
  const parts = hhmmss.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

/** Convierte segundos → "HH:MM:SS" */
function fromSeconds(secs: number): string {
  const s = Math.round(Math.abs(secs));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, '0')).join(':');
}

/** Promedio de un array de valores "HH:MM:SS", ignorando nulos/vacíos */
function avgHHMMSS(values: (string | null)[]): string {
  const valid = values.filter(Boolean) as string[];
  if (!valid.length) return '00:00:00';
  const total = valid.reduce((acc, v) => acc + toSeconds(v), 0);
  return fromSeconds(total / valid.length);
}
