import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  DashboardState,
  AdvisorRow,
  TiemposAtencionRow,
  SLAMetric,
  ChartDataPoint,
  LoadDistributionItem,
  MasterDataRow,
} from '../../types';
import {
  fetchOperacionesHoy,
  mapToTiemposAtencion,
  mapToAdvisors,
  mapToMasterData,
  mapToLoadDistribution,
  mapToChartData,
} from '../../services/operaciones.service';
import {
  fetchOperacionesResumen,
  mapResumenToAdvisors,
  mapResumenToTiemposAtencion,
  mapResumenToMasterData,
  mapResumenToLoadDistribution,
  mapResumenToChartData,
} from '../../services/resumen.service';
import type { RootState } from '../../app/store';

const initialState: DashboardState = {
  metrics: [],
  advisors: [],
  tiemposAtencion: [],
  masterData: [],
  conversations: [],
  chartData: [],
  loadDistribution: [],
  clientesUnicosGlobal: null,
  isLoading: false,
  error: null,
};

// ─── Async Thunk ──────────────────────────────────────────────────────────────

/** Convierte una selección de FilterOption[] a IDs separados por coma, o undefined si está vacía. */
const toIds = (opts: { value: string | number }[]): string | undefined =>
  opts.length > 0 ? opts.map((o) => String(o.value)).join(',') : undefined;

/**
 * Para Skills: si no hay ninguna seleccionada usa TODAS las opciones del catálogo.
 * Esto garantiza que el API filtre solo por los skills disponibles para el usuario
 * en lugar de omitir el parámetro (lo que devolvería todos los skills del sistema).
 */
const toSkillIds = (
  selected: { value: string | number }[],
  allOptions: { value: string | number }[],
): string | undefined => {
  const source = selected.length > 0 ? selected : allOptions;
  return toIds(source);
};

/**
 * Extrae el valor numérico de tipo_usuario.
 * El catálogo devuelve: 2=Todos, 1=Operador, -1=Bot.
 * Si no hay selección o el valor es 2 (Todos) → undefined (omitir el param).
 */
const toTipoUsuario = (opts: { value: string | number }[]): number | undefined => {
  if (opts.length === 0) return undefined;
  const val = Number(opts[0].value);
  return val === 2 ? undefined : val;
};

export const fetchDashboardHoy = createAsyncThunk(
  'dashboard/fetchDashboardHoy',
  async (_: void, { getState, signal }) => {
    const state    = getState() as RootState;
    const userData = state.user.userData;
    const filters  = state.filters;

    if (!userData?.id_empresa || !userData?.url_api) {
      throw new Error('No se encontró id_empresa o url_api en el estado del usuario.');
    }

    const catalogos = state.catalogos;

    const result = await fetchOperacionesHoy({
      apiUrl:        userData.url_api,
      idEmpresa:     userData.id_empresa,
      offsetHoras:   userData.offset_horas ?? 0,
      queryMode:     filters.queryMode,
      fechaInicio:   filters.fechaInicio,
      fechaFin:      filters.fechaFin,
      tipoUsuario:    toTipoUsuario(filters.tipoUsuario),
      canales:        toIds(filters.canal),
      skills:         toSkillIds(filters.skills, catalogos.skills),
      redesSociales:  toIds(filters.redSocial),
      gestiones:      toIds(filters.gestiones),
      usuariosInicio: toIds(filters.usuarioInicia),
      usuariosFin:    toIds(filters.usuarioFinaliza),
      signal,
    });

    const rows = result.data;

    return {
      tiemposAtencion:  mapToTiemposAtencion(rows),
      advisors:         mapToAdvisors(rows),
      masterData:       mapToMasterData(rows),
      loadDistribution: mapToLoadDistribution(rows),
      chartData:        mapToChartData(rows),
    };
  }
);

/**
 * Thunk para el endpoint /operaciones/resumen.
 * Se activa siempre que queryMode === 'range'.
 * Consume filas pre-agregadas del batch: no realiza ninguna agregación extra,
 * simplemente las transforma al mismo formato de tipos que usa el dashboard.
 */
export const fetchDashboardResumen = createAsyncThunk(
  'dashboard/fetchDashboardResumen',
  async (_: void, { getState, signal }) => {
    const state    = getState() as RootState;
    const userData = state.user.userData;
    const filters  = state.filters;

    if (!userData?.id_empresa || !userData?.url_api) {
      throw new Error('No se encontró id_empresa o url_api en el estado del usuario.');
    }

    const catalogos = state.catalogos;

    const result = await fetchOperacionesResumen({
      apiUrl:        userData.url_api,
      idEmpresa:     userData.id_empresa,
      offsetHoras:   userData.offset_horas ?? 0,
      fechaInicio:   filters.fechaInicio,
      fechaFin:      filters.fechaFin,
      tipoUsuario:    toTipoUsuario(filters.tipoUsuario),
      canales:        toIds(filters.canal),
      skills:         toSkillIds(filters.skills, catalogos.skills),
      redesSociales:  toIds(filters.redSocial),
      gestiones:      toIds(filters.gestiones),
      usuariosInicio: toIds(filters.usuarioInicia),
      usuariosFin:    toIds(filters.usuarioFinaliza),
      signal,
    });

    const rows = result.data;

    // ── Clientes únicos: elegir la fuente más precisa ──────────────────────
    // clientesUnicosTotal (de la tabla control) es el distinct real por día,
    // pero no tiene en cuenta los filtros de dimensión activos.
    // Si hay filtros activos → sumar CLIENTES_UNICOS por grupo desde los datos
    //   filtrados (puede haber leve sobreconteo entre grupos, pero es coherente
    //   con lo que el usuario seleccionó).
    // Si no hay filtros → usar el valor exacto del batch.
    const filtersActivos =
      filters.canal.length > 0 ||
      filters.redSocialModificado ||
      filters.gestiones.length > 0 ||
      filters.usuarioInicia.length > 0 ||
      filters.usuarioFinaliza.length > 0 ||
      toTipoUsuario(filters.tipoUsuario) !== undefined ||
      // Skills: activo solo cuando se selecciona un subconjunto (no todos)
      (filters.skills.length > 0 && filters.skills.length < catalogos.skills.length);

    const clientesUnicosGlobal = filtersActivos
      ? rows.reduce((sum, r) => sum + r.CLIENTES_UNICOS, 0)
      : result.clientesUnicosTotal;

    return {
      tiemposAtencion:     mapResumenToTiemposAtencion(rows),
      advisors:            mapResumenToAdvisors(rows),
      masterData:          mapResumenToMasterData(rows),
      loadDistribution:    mapResumenToLoadDistribution(rows),
      chartData:           mapResumenToChartData(rows),
      clientesUnicosGlobal,
    };
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    setMetrics(state, action: PayloadAction<SLAMetric[]>) {
      state.metrics = action.payload;
    },
    setAdvisors(state, action: PayloadAction<AdvisorRow[]>) {
      state.advisors = action.payload;
    },
    setTiemposAtencion(state, action: PayloadAction<TiemposAtencionRow[]>) {
      state.tiemposAtencion = action.payload;
    },
    setMasterData(state, action: PayloadAction<MasterDataRow[]>) {
      state.masterData = action.payload;
    },
    setChartData(state, action: PayloadAction<ChartDataPoint[]>) {
      state.chartData = action.payload;
    },
    setLoadDistribution(state, action: PayloadAction<LoadDistributionItem[]>) {
      state.loadDistribution = action.payload;
    },
    setDashboardData(
      state,
      action: PayloadAction<{
        metrics?: SLAMetric[];
        advisors?: AdvisorRow[];
        tiemposAtencion?: TiemposAtencionRow[];
        masterData?: MasterDataRow[];
        chartData?: ChartDataPoint[];
        loadDistribution?: LoadDistributionItem[];
      }>
    ) {
      if (action.payload.metrics)          state.metrics          = action.payload.metrics;
      if (action.payload.advisors)         state.advisors         = action.payload.advisors;
      if (action.payload.tiemposAtencion)  state.tiemposAtencion  = action.payload.tiemposAtencion;
      if (action.payload.masterData)       state.masterData       = action.payload.masterData;
      if (action.payload.chartData)        state.chartData        = action.payload.chartData;
      if (action.payload.loadDistribution) state.loadDistribution = action.payload.loadDistribution;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardHoy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardHoy.fulfilled, (state, action) => {
        state.tiemposAtencion        = action.payload.tiemposAtencion;
        state.advisors               = action.payload.advisors;
        state.masterData             = action.payload.masterData;
        state.loadDistribution       = action.payload.loadDistribution;
        state.chartData              = action.payload.chartData;
        state.clientesUnicosGlobal   = null; // /hoy y /periodo usan suma desde advisors
        state.isLoading              = false;
        state.error                  = null;
      })
      .addCase(fetchDashboardHoy.rejected, (state, action) => {
        state.isLoading = false;
        if (action.error.name !== 'AbortError') {
          state.error = action.error.message ?? 'Error al cargar datos';
        }
      })
      // ── Resumen (endpoint pre-agregado del batch) ──────────────────────────
      .addCase(fetchDashboardResumen.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardResumen.fulfilled, (state, action) => {
        state.tiemposAtencion      = action.payload.tiemposAtencion;
        state.advisors             = action.payload.advisors;
        state.masterData           = action.payload.masterData;
        state.loadDistribution     = action.payload.loadDistribution;
        state.chartData            = action.payload.chartData;
        state.clientesUnicosGlobal = action.payload.clientesUnicosGlobal;
        state.isLoading            = false;
        state.error                = null;
      })
      .addCase(fetchDashboardResumen.rejected, (state, action) => {
        state.isLoading = false;
        if (action.error.name !== 'AbortError') {
          state.error = action.error.message ?? 'Error al cargar datos';
        }
      });
  },
});

export const {
  setLoading,
  setError,
  setMetrics,
  setAdvisors,
  setTiemposAtencion,
  setMasterData,
  setChartData,
  setLoadDistribution,
  setDashboardData,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
