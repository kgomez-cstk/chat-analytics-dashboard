import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { FilterOption } from '../../types';
import { fetchAllCatalogos } from '../../services/catalogos.service';
import type { RootState } from '../../app/store';

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
  async (_: void, { getState, signal }) => {
    const state    = getState() as RootState;
    const userData = state.user.userData;

    if (!userData?.url_api || !userData?.id_empresa || !userData?.id_usuario) {
      throw new Error('Faltan datos de sesión (url_api, id_empresa, id_usuario).');
    }

    const result = await fetchAllCatalogos({
      apiUrl:    userData.url_api,
      idUsuario: userData.id_usuario,
      idEmpresa: userData.id_empresa,
      signal,
    });

    return result;
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
      });
  },
});

export default catalogosSlice.reducer;
