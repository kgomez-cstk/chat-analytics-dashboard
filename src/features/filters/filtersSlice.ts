import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FilterOption, FilterState } from '../../types';
import { getFechasDia } from '../../utils/dateUtils';

const today = getFechasDia(-6);

const initialState: FilterState = {
  canal: [],
  skills: [],
  tipoUsuario: [],
  redSocial: [{ value: 1, label: 'WhatsApp' }],
  fechaInicio: today.inicio,
  fechaFin: today.fin,
  dateMode: 'dateonly',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCanal(state, action: PayloadAction<FilterOption[]>) {
      state.canal = action.payload;
    },
    setSkills(state, action: PayloadAction<FilterOption[]>) {
      state.skills = action.payload;
    },
    setTipoUsuario(state, action: PayloadAction<FilterOption[]>) {
      state.tipoUsuario = action.payload;
    },
    setRedSocial(state, action: PayloadAction<FilterOption[]>) {
      state.redSocial = action.payload;
    },
    setFechaInicio(state, action: PayloadAction<string>) {
      state.fechaInicio = action.payload;
    },
    setFechaFin(state, action: PayloadAction<string>) {
      state.fechaFin = action.payload;
    },
    setDateMode(state, action: PayloadAction<'datetime' | 'dateonly'>) {
      state.dateMode = action.payload;
    },
    resetFilters() {
      const t = getFechasDia(-6);
      return {
        canal: [],
        skills: [],
        tipoUsuario: [],
        redSocial: [{ value: 1, label: 'WhatsApp' }],
        fechaInicio: t.inicio,
        fechaFin: t.fin,
        dateMode: 'dateonly' as const,
      };
    },
  },
});

export const {
  setCanal,
  setSkills,
  setTipoUsuario,
  setRedSocial,
  setFechaInicio,
  setFechaFin,
  setDateMode,
  resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;
