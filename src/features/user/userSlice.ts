import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserData } from '../../types';

interface UserState {
  userData: UserData | null;
  isInitialized: boolean;
  elmtPaginado: number;
  activePage: 'dashboard';
}

const initialState: UserState = {
  userData: null,
  isInitialized: false,
  elmtPaginado: 20,
  activePage: 'dashboard',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserData | string>) {
      if (typeof action.payload === 'string') {
        try {
          const parsed = JSON.parse(action.payload) as UserData;
          state.userData = parsed;
          if (parsed.elmtPaginado) state.elmtPaginado = parsed.elmtPaginado;
        } catch {
          state.userData = null;
        }
      } else {
        state.userData = action.payload;
        if (action.payload.elmtPaginado) state.elmtPaginado = action.payload.elmtPaginado;
      }
      state.isInitialized = true;
    },
    setActivePage(state, action: PayloadAction<'dashboard'>) {
      state.activePage = action.payload;
    },
    clearUserData(state) {
      state.userData = null;
      state.isInitialized = false;
      state.elmtPaginado = 20;
      state.activePage = 'dashboard';
    },
  },
});

export const { setUserData, setActivePage, clearUserData } = userSlice.actions;
export default userSlice.reducer;
