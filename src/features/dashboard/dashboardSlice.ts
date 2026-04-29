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
import type { RootState } from '../../app/store';

const initialState: DashboardState = {
  metrics: [],
  advisors: [],
  tiemposAtencion: [],
  masterData: [],
  conversations: [],
  chartData: [],
  loadDistribution: [],
  isLoading: false,
  error: null,
};

// ─── Async Thunk ──────────────────────────────────────────────────────────────

export const fetchDashboardHoy = createAsyncThunk(
  'dashboard/fetchDashboardHoy',
  async (_: void, { getState, signal }) => {
    const state    = getState() as RootState;
    const userData = state.user.userData;

    if (!userData?.id_empresa || !userData?.url_api) {
      throw new Error('No se encontró id_empresa o url_api en el estado del usuario.');
    }

    const result = await fetchOperacionesHoy({
      apiUrl:      userData.url_api,
      idEmpresa:   userData.id_empresa,
      offsetHoras: userData.offset_horas ?? 0,
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
        state.tiemposAtencion  = action.payload.tiemposAtencion;
        state.advisors         = action.payload.advisors;
        state.masterData       = action.payload.masterData;
        state.loadDistribution = action.payload.loadDistribution;
        state.chartData        = action.payload.chartData;
        state.isLoading        = false;
        state.error            = null;
      })
      .addCase(fetchDashboardHoy.rejected, (state, action) => {
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
