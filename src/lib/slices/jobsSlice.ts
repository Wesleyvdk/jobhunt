import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { JobStatus } from './uiSlice'

export interface Job {
  id: string
  company: string
  position: string
  applicationDate: string
  status: JobStatus
  notes?: string
  jobLink?: string
  followUpDate?: string
  createdAt: string
  updatedAt?: string
}

interface JobsState {
  jobs: Job[]
  isLoading: boolean
  error: string | null
}

const initialState: JobsState = {
  jobs: [],
  isLoading: false,
  error: null,
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload
      state.isLoading = false
      state.error = null
    },
    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs.unshift(action.payload)
    },
    updateJob: (state, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex(job => job.id === action.payload.id)
      if (index !== -1) {
        state.jobs[index] = action.payload
      }
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter(job => job.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const { setJobs, addJob, updateJob, deleteJob, setLoading, setError } = jobsSlice.actions
export default jobsSlice.reducer 