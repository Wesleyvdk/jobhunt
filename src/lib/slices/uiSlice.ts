import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Updated job statuses with better meanings
export type JobStatus = 'Prospect' | 'Applied' | 'Interviewed' | 'Rejected' | 'Hired' | 'Ghosted'

interface UiState {
  theme: 'light' | 'dark'
  isJobModalOpen: boolean
  selectedJobId: number | null
  filters: {
    status: JobStatus | 'All'
    search: string
    dateFrom: string
    dateTo: string
  }
  sortBy: 'company' | 'position' | 'applicationDate' | 'status'
  sortOrder: 'asc' | 'desc'
}

const initialState: UiState = {
  theme: 'light',
  isJobModalOpen: false,
  selectedJobId: null,
  filters: {
    status: 'All',
    search: '',
    dateFrom: '',
    dateTo: ''
  },
  sortBy: 'applicationDate',
  sortOrder: 'desc'
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    openJobModal: (state) => {
      state.isJobModalOpen = true
    },
    closeJobModal: (state) => {
      state.isJobModalOpen = false
    },
    setSelectedJobId: (state, action: PayloadAction<number | null>) => {
      state.selectedJobId = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<UiState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    setSorting: (state, action: PayloadAction<{ sortBy: UiState['sortBy'], sortOrder: UiState['sortOrder'] }>) => {
      state.sortBy = action.payload.sortBy
      state.sortOrder = action.payload.sortOrder
    }
  }
})

export const { setTheme, openJobModal, closeJobModal, setSelectedJobId, setFilters, clearFilters, setSorting } = uiSlice.actions
export default uiSlice.reducer