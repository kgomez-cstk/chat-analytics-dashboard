/**
 * Contrato de respuesta común a todos los endpoints de catálogo:
 * GET /api/catalogos/*
 */
export interface CatalogResponse<T> {
  success: boolean;
  total: number;
  data: T[];
  message?: string;
}

// ─── Endpoint 1: GET /api/catalogos/tipo_usuario ──────────────────────────────
export interface TipoUsuarioItem {
  label: string;
  value: number;    // 2=Todos, 1=Operador, -1=Bot
}

// ─── Endpoint 2: GET /api/catalogos/canales ───────────────────────────────────
export interface CanalItem {
  ID_BOT: number;
  DESCRIPCION: string;
}

// ─── Endpoint 3: GET /api/catalogos/skill ────────────────────────────────────
export interface SkillItem {
  ID_SKILL: number;
  ID_EMPRESA: number;
  NOMBRE_SKILL: string;
  ESTADO: number;
  MENSAJE: string | null;
  SISTEMA: number;
  NO_USUARIOS: number;
  CREADO_EL: string | null;
  MODIFICADO_EL: string | null;
}

// ─── Endpoint 4: GET /api/catalogos/redes_sociales ───────────────────────────
export interface RedSocialItem {
  ID_RED_SOCIAL: number;
  NOMBRE: string;
  [key: string]: unknown;
}

// ─── Endpoint 5: GET /api/catalogos/gestiones ────────────────────────────────
export interface GestionItem {
  ID_TIPO_GESTION: number;
  GESTION: string;
  ESTADO: number;
  ELIMINADO: number;
  ID_EMPRESA: number;
  [key: string]: unknown;
}

// ─── Endpoint 6: GET /api/catalogos/operadores ───────────────────────────────
export interface OperadorItem {
  ID_USUARIO: number;
  ID_EMPRESA: number;
  NOMBRE: string;
  APELLIDO: string;
  NOMBRE_USUARIO: string;
  ESTADO: number;
}
