import type { FilterOption } from '../types';
import type {
  CatalogResponse,
  TipoUsuarioItem,
  CanalItem,
  SkillItem,
  RedSocialItem,
  GestionItem,
  OperadorItem,
} from './catalogos.types';

// ─── Parámetros de contexto de usuario ───────────────────────────────────────

export interface CatalogosParams {
  apiUrl: string;
  idUsuario: number;
  idEmpresa: number;
  signal?: AbortSignal;
}

// ─── Helper: fetch genérico con validación de contrato ───────────────────────

async function fetchCatalog<T>(
  url: string,
  signal?: AbortSignal
): Promise<T[]> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }

  const json: CatalogResponse<T> = await response.json();

  if (!json.success) {
    throw new Error(json.message ?? 'El catálogo devolvió success: false');
  }

  return json.data;
}

// ─── Endpoint 1: Tipo de usuario (sin params de BD) ──────────────────────────

export async function fetchTipoUsuarioCatalog(
  apiUrl: string,
  signal?: AbortSignal
): Promise<FilterOption[]> {
  const data = await fetchCatalog<TipoUsuarioItem>(
    `${apiUrl}/catalogos/tipo_usuario`,
    signal
  );
  return data.map((item) => ({ value: item.value, label: item.label }));
}

// ─── Endpoint 2: Canales ──────────────────────────────────────────────────────

export async function fetchCanalesCatalog(
  { apiUrl, idUsuario, idEmpresa, signal }: CatalogosParams
): Promise<FilterOption[]> {
  const data = await fetchCatalog<CanalItem>(
    `${apiUrl}/catalogos/canales?id_usuario=${idUsuario}&id_empresa=${idEmpresa}`,
    signal
  );
  return data.map((item) => ({ value: item.ID_BOT, label: item.DESCRIPCION }));
}

// ─── Endpoint 3: Skills ───────────────────────────────────────────────────────

export async function fetchSkillsCatalog(
  { apiUrl, idUsuario, idEmpresa, signal }: CatalogosParams
): Promise<FilterOption[]> {
  const data = await fetchCatalog<SkillItem>(
    `${apiUrl}/catalogos/skill?id_usuario=${idUsuario}&id_empresa=${idEmpresa}`,
    signal
  );
  return data.map((item) => ({ value: item.ID_SKILL, label: item.NOMBRE_SKILL }));
}

// ─── Endpoint 4: Redes Sociales ───────────────────────────────────────────────

export async function fetchRedesSocialesCatalog(
  { apiUrl, idUsuario, idEmpresa, signal }: CatalogosParams
): Promise<FilterOption[]> {
  const data = await fetchCatalog<RedSocialItem>(
    `${apiUrl}/catalogos/redes_sociales?id_usuario=${idUsuario}&id_empresa=${idEmpresa}`,
    signal
  );
  return data.map((item) => ({ value: item.ID_RED_SOCIAL, label: item.NOMBRE }));
}

// ─── Endpoint 5: Gestiones ───────────────────────────────────────────────────

export async function fetchGestionesCatalog(
  { apiUrl, idEmpresa, signal }: Pick<CatalogosParams, 'apiUrl' | 'idEmpresa' | 'signal'>
): Promise<FilterOption[]> {
  const data = await fetchCatalog<GestionItem>(
    `${apiUrl}/catalogos/gestiones?id_empresa=${idEmpresa}`,
    signal
  );
  return data.map((item) => ({ value: item.ID_TIPO_GESTION, label: item.GESTION }));
}

// ─── Endpoint 6: Operadores ───────────────────────────────────────────────────

export interface OperadoresParams extends Pick<CatalogosParams, 'apiUrl' | 'idEmpresa' | 'signal'> {
  /** IDs de canal separados por coma — limita por permisos sobre esos canales */
  canales?: string;
  /** IDs de skill separados por coma — limita por permisos sobre esos skills */
  skills?: string;
  /** IDs de red social separados por coma — limita por permisos sobre esas redes */
  redesSociales?: string;
}

export async function fetchOperadoresCatalog(
  { apiUrl, idEmpresa, canales, skills, redesSociales, signal }: OperadoresParams
): Promise<FilterOption[]> {
  const qs = new URLSearchParams({ id_empresa: String(idEmpresa) });
  if (canales)       qs.set('canales',        canales);
  if (skills)        qs.set('skills',         skills);
  if (redesSociales) qs.set('redes_sociales', redesSociales);

  const data = await fetchCatalog<OperadorItem>(
    `${apiUrl}/catalogos/operadores?${qs.toString()}`,
    signal
  );
  return data.map((item) => ({
    value: item.ID_USUARIO,
    label: item.NOMBRE_USUARIO,
  }));
}

// ─── Orquestador: carga todos los catálogos en paralelo ──────────────────────

export interface AllCatalogos {
  tipoUsuario: FilterOption[];
  canales: FilterOption[];
  skills: FilterOption[];
  redesSociales: FilterOption[];
  gestiones: FilterOption[];
}

/**
 * Carga los 5 catálogos de dimensión en paralelo (Promise.allSettled).
 * Operadores se excluye intencionalmente: el thunk lo consulta de forma
 * condicional solo si el usuario tiene al menos 1 permiso en canales,
 * skills o redesSociales.
 */
export async function fetchAllCatalogos(
  params: CatalogosParams
): Promise<AllCatalogos & { errors: string[] }> {
  const [
    tipoUsuarioResult,
    canalesResult,
    skillsResult,
    redesSocialesResult,
    gestionesResult,
  ] = await Promise.allSettled([
    fetchTipoUsuarioCatalog(params.apiUrl, params.signal),
    fetchCanalesCatalog(params),
    fetchSkillsCatalog(params),
    fetchRedesSocialesCatalog(params),
    fetchGestionesCatalog(params),
  ]);

  const resolve = <T>(result: PromiseSettledResult<T[]>): T[] =>
    result.status === 'fulfilled' ? result.value : [];

  const errors: string[] = [
    tipoUsuarioResult,
    canalesResult,
    skillsResult,
    redesSocialesResult,
    gestionesResult,
  ]
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)));

  return {
    tipoUsuario: resolve(tipoUsuarioResult),
    canales: resolve(canalesResult),
    skills: resolve(skillsResult),
    redesSociales: resolve(redesSocialesResult),
    gestiones: resolve(gestionesResult),
    errors,
  };
}
