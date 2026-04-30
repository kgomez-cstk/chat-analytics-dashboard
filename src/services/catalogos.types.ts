/**
 * Contrato de respuesta común a todos los endpoints de catálogo:
 * GET /catalogos/*
 */
export interface CatalogResponse<T> {
  success: boolean;
  total: number;
  data: T[];
  message?: string;
}

// ─── Endpoint 1: GET /catalogos/tipo_usuario ──────────────────────────────
export interface TipoUsuarioItem {
  label: string;
  value: number;    // 2=Todos, 1=Operador, -1=Bot
}

// ─── Endpoint 2: GET /catalogos/canales ───────────────────────────────────
export interface CanalItem {
  ID_BOT: number;
  DESCRIPCION: string;
}

// ─── Endpoint 3: GET /catalogos/skill ────────────────────────────────────
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

// ─── Endpoint 4: GET /catalogos/redes_sociales ───────────────────────────
export interface RedSocialItem {
  ID_RED_SOCIAL: number;
  NOMBRE: string;
  [key: string]: unknown;
}

// ─── Endpoint 5: GET /catalogos/gestiones ────────────────────────────────
export interface GestionItem {
  ID_TIPO_GESTION: number;
  GESTION: string;
  ESTADO: number;
  ELIMINADO: number;
  ID_EMPRESA: number;
  [key: string]: unknown;
}

// ─── Endpoint 6: GET /catalogos/operadores ───────────────────────────────
export interface OperadorItem {
  ID_USUARIO: number;
  ID_EMPRESA: number;
  NOMBRE: string;
  APELLIDO: string;
  NOMBRE_USUARIO: string;
  ESTADO: number;
}
