import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { FilterOption } from '../../types';
import { fetchAllCatalogos, fetchOperadoresCatalog } from '../../services/catalogos.service';
import { setRedSocialInicial } from './filtersSlice';
import type { RootState } from '../../app/store';

/** Convierte un array de FilterOption a IDs separados por coma, o undefined si está vacío. */
const toIds = (opts: { value: string | number }[]): string | undefined =>
  opts.length > 0 ? opts.map((o) => String(o.value)).join(',') : undefined;

// ─── Estado ───────────────────────────────────────────────────────────────────

interface CatalogosState {
  tipoUsuario:   FilterOption[];
  canales:       FilterOption[];
  skills:        FilterOption[];
  redesSociales: FilterOption[];
  gestiones:     FilterOption[];
  operadores:    FilterOption[];
  isLoading:     boolean;
  error:         string | null;
}

const initialState: CatalogosState = {
  tipoUsuario:   [],
  canales:       [],
  skills:        [],
  redesSociales: [],
  gestiones:     [],
  operadores:    [],
  isLoading:     false,
  error:         null,
};

// ─── Async Thunk ──────────────────────────────────────────────────────────────

/**
 * Carga los 6 catálogos de filtros en paralelo.
 * Debe dispararse cuando isInitialized=true (postMessage recibido).
 * Los catálogos individuales que fallen retornan [] para no bloquear el UI.
 */
export const fetchCatalogos = createAsyncThunk(
  'catalogos/fetchCatalogos',
  async (_: void, { getState, dispatch, signal }) => {
    const state    = getState() as RootState;
    const userData = state.user.userData;

    if (!userData?.url_api || !userData?.id_empresa || !userData?.id_usuario) {
      throw new Error('Faltan datos de sesión (url_api, id_empresa, id_usuario).');
    }

    // 1. Cargar los 5 catálogos de dimensión en paralelo
    const result = await fetchAllCatalogos({
      apiUrl:    userData.url_api,
      idUsuario: userData.id_usuario,
      idEmpresa: userData.id_empresa,
      signal,
    });

    // 2. Validar la pre-selección de WhatsApp contra el catálogo real.
    //    Si WhatsApp (id=1) NO viene en el catálogo → limpiar la selección.
    //    Si SÍ viene → dejar el estado inicial intacto (ya tiene [whatsapp]).
    //    Esto evita la transición [] → [whatsapp] que causaría disparos innecesarios
    //    del useEffect de operadores en FilterSection.
    const whatsappEnCatalogo = result.redesSociales.some((r) => String(r.value) === '1');
    if (!whatsappEnCatalogo) {
      dispatch(setRedSocialInicial([]));
    }

    // 3. Consultar operadores solo si el usuario tiene al menos 1 permiso
    //    en canales, skills o redesSociales.
    const tienePermisos =
      result.canales.length > 0 ||
      result.skills.length > 0 ||
      result.redesSociales.length > 0;

    let operadores: FilterOption[] = [];
    if (tienePermisos) {
      // Si WhatsApp está en el catálogo usamos "1" (estado inicial); si no, sin filtro de red social
      const redSocialInicial = whatsappEnCatalogo ? '1' : undefined;
      try {
        operadores = await fetchOperadoresCatalog({
          apiUrl:        userData.url_api,
          idEmpresa:     userData.id_empresa,
          redesSociales: redSocialInicial,
          signal,
        });
      } catch { /* Si falla, operadores queda [] sin bloquear el resto */ }
    }

    return { ...result, operadores };
  }
);

/**
 * Re-consulta únicamente la lista de operadores aplicando los filtros actuales
 * de canal, skill y red social como restricción de permisos.
 * Se dispara desde FilterSection cada vez que cambia alguno de esos tres filtros.
 */
export const fetchOperadoresFiltrados = createAsyncThunk(
  'catalogos/fetchOperadoresFiltrados',
  async (_: void, { getState, signal }) => {
    const state     = getState() as RootState;
    const userData  = state.user.userData;
    const filters   = state.filters;
    const catalogos = state.catalogos;

    if (!userData?.url_api || !userData?.id_empresa) {
      throw new Error('Faltan datos de sesión (url_api, id_empresa).');
    }

    // No consultar operadores si el usuario no tiene permisos en ninguna dimensión
    const tienePermisos =
      catalogos.canales.length > 0 ||
      catalogos.skills.length > 0 ||
      catalogos.redesSociales.length > 0;

    if (!tienePermisos) return [] as FilterOption[];

    return fetchOperadoresCatalog({
      apiUrl:        userData.url_api,
      idEmpresa:     userData.id_empresa,
      canales:       toIds(filters.canal),
      skills:        toIds(filters.skills),
      redesSociales: toIds(filters.redSocial),
      signal,
    });
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const catalogosSlice = createSlice({
  name: 'catalogos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalogos.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchCatalogos.fulfilled, (state, action) => {
        state.tipoUsuario   = action.payload.tipoUsuario;
        state.canales       = action.payload.canales;
        state.skills        = action.payload.skills;
        state.redesSociales = action.payload.redesSociales;
        state.gestiones     = action.payload.gestiones;
        state.operadores    = action.payload.operadores;
        state.isLoading     = false;
        // Si algún catálogo individual falló, mostramos el primer mensaje
        state.error = action.payload.errors.length > 0
          ? `Catálogos parciales: ${action.payload.errors[0]}`
          : null;
      })
      .addCase(fetchCatalogos.rejected, (state, action) => {
        state.isLoading = false;
        if (action.error.name !== 'AbortError') {
          state.error = action.error.message ?? 'Error al cargar catálogos de filtros';
        }
      })
      // ── Operadores filtrados por permisos (canal / skill / red social) ────────
      .addCase(fetchOperadoresFiltrados.fulfilled, (state, action) => {
        state.operadores = action.payload;
      });
  },
});

export default catalogosSlice.reducer;
