import { configureStore } from '@reduxjs/toolkit'
import uiSlice from './slices/uiSlice'
import jobsSlice from './slices/jobsSlice'
import preferencesSlice from './slices/preferencesSlice'

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    jobs: jobsSlice,
    preferences: preferencesSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch