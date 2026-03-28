import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DashboardState, AdvisorRow, TiemposAtencionRow, SLAMetric, ChartDataPoint, LoadDistributionItem } from '../../types';

const initialState: DashboardState = {
  metrics: [],
  advisors: [],
  tiemposAtencion: [],
  conversations: [],
  chartData: [],
  loadDistribution: [],
  isLoading: false,
  error: null,
};

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
    setChartData(state, action: PayloadAction<ChartDataPoint[]>) {
      state.chartData = action.payload;
    },
    setLoadDistribution(state, action: PayloadAction<LoadDistributionItem[]>) {
      state.loadDistribution = action.payload;
    },
    setDashboardData(
      state,
      action: PayloadAction<{
        metrics: SLAMetric[];
        advisors: AdvisorRow[];
        tiemposAtencion?: TiemposAtencionRow[];
        chartData: ChartDataPoint[];
        loadDistribution: LoadDistributionItem[];
      }>
    ) {
      state.metrics = action.payload.metrics;
      state.advisors = action.payload.advisors;
      if (action.payload.tiemposAtencion) {
        state.tiemposAtencion = action.payload.tiemposAtencion;
      }
      state.chartData = action.payload.chartData;
      state.loadDistribution = action.payload.loadDistribution;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setMetrics,
  setAdvisors,
  setTiemposAtencion,
  setChartData,
  setLoadDistribution,
  setDashboardData,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
