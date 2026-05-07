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
  gestiones: [],
  usuarioInicia: [],
  usuarioFinaliza: [],
  fechaInicio: today.inicio,
  fechaFin: today.fin,
  dateMode: 'dateonly',
  queryMode: 'today',
  redSocialModificado: false,
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
      state.redSocialModificado = true;
    },
    /** Pre-selección automática (desde API o reset): no marca redSocialModificado. */
    setRedSocialInicial(state, action: PayloadAction<FilterOption[]>) {
      state.redSocial = action.payload;
    },
    setGestiones(state, action: PayloadAction<FilterOption[]>) {
      state.gestiones = action.payload;
    },
    setUsuarioInicia(state, action: PayloadAction<FilterOption[]>) {
      state.usuarioInicia = action.payload;
    },
    setUsuarioFinaliza(state, action: PayloadAction<FilterOption[]>) {
      state.usuarioFinaliza = action.payload;
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
    setQueryMode(state, action: PayloadAction<'today' | 'range'>) {
      state.queryMode = action.payload;
      if (action.payload === 'range') {
        // Default to Yesterday (Today - 1)
        const yesterday = getFechasDia(-6 - 24); // -6 for offset, -24 for yesterday
        state.fechaInicio = yesterday.inicio;
        state.fechaFin = yesterday.fin;
      }
    },
    resetFilters() {
      const t = getFechasDia(-6);
      return {
        canal: [],
        skills: [],
        tipoUsuario: [],
        redSocial: [{ value: 1, label: 'WhatsApp' }],
        gestiones: [],
        usuarioInicia: [],
        usuarioFinaliza: [],
        fechaInicio: t.inicio,
        fechaFin: t.fin,
        dateMode: 'dateonly' as const,
        queryMode: 'today' as const,
        redSocialModificado: false,
      };
    },
  },
});

export const {
  setCanal,
  setSkills,
  setTipoUsuario,
  setRedSocial,
  setRedSocialInicial,
  setGestiones,
  setUsuarioInicia,
  setUsuarioFinaliza,
  setFechaInicio,
  setFechaFin,
  setDateMode,
  setQueryMode,
  resetFilters,
} = filtersSlice.actions;
export default filtersSlice.reducer;
