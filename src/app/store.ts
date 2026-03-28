import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import filtersReducer from '../features/filters/filtersSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    filters: filtersReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
