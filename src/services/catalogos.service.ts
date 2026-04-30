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

export async function fetchOperadoresCatalog(
  { apiUrl, idEmpresa, signal }: Pick<CatalogosParams, 'apiUrl' | 'idEmpresa' | 'signal'>
): Promise<FilterOption[]> {
  const data = await fetchCatalog<OperadorItem>(
    `${apiUrl}/catalogos/operadores?id_empresa=${idEmpresa}`,
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
  operadores: FilterOption[];
}

/**
 * Llama los 6 endpoints de catálogo en paralelo (Promise.allSettled).
 * Si alguno falla devuelve array vacío para ese catálogo y propaga
 * el primer mensaje de error encontrado.
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
    operadoresResult,
  ] = await Promise.allSettled([
    fetchTipoUsuarioCatalog(params.apiUrl, params.signal),
    fetchCanalesCatalog(params),
    fetchSkillsCatalog(params),
    fetchRedesSocialesCatalog(params),
    fetchGestionesCatalog(params),
    fetchOperadoresCatalog(params),
  ]);

  const resolve = <T>(result: PromiseSettledResult<T[]>): T[] =>
    result.status === 'fulfilled' ? result.value : [];

  const errors: string[] = [
    tipoUsuarioResult,
    canalesResult,
    skillsResult,
    redesSocialesResult,
    gestionesResult,
    operadoresResult,
  ]
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)));

  return {
    tipoUsuario: resolve(tipoUsuarioResult),
    canales: resolve(canalesResult),
    skills: resolve(skillsResult),
    redesSociales: resolve(redesSocialesResult),
    gestiones: resolve(gestionesResult),
    operadores: resolve(operadoresResult),
    errors,
  };
}
