import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type JobStatus = 'Open' | 'Rejected' | 'Invited' | 'Interviewed' | 'Hired'

interface UiState {
  theme: 'light' | 'dark'
  isJobModalOpen: boolean
  selectedJobId: string | null
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
    dateTo: '',
  },
  sortBy: 'applicationDate',
  sortOrder: 'desc',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    openJobModal: (state, action: PayloadAction<string | null>) => {
      state.isJobModalOpen = true
      state.selectedJobId = action.payload
    },
    closeJobModal: (state) => {
      state.isJobModalOpen = false
      state.selectedJobId = null
    },
    setFilters: (state, action: PayloadAction<Partial<UiState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setSorting: (state, action: PayloadAction<{ sortBy: UiState['sortBy']; sortOrder: UiState['sortOrder'] }>) => {
      state.sortBy = action.payload.sortBy
      state.sortOrder = action.payload.sortOrder
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const { toggleTheme, openJobModal, closeJobModal, setFilters, setSorting, clearFilters } = uiSlice.actions
export default uiSlice.reducer 