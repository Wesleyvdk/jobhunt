import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import { Job } from '../slices/jobsSlice'
import { JobFormData, JobUpdateData } from '../validations/job'
import { useAppDispatch } from '../hooks'
import { addJob, updateJob, deleteJob, setError } from '../slices/jobsSlice'

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.get<Job[]>('/jobs'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateJob = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: (jobData: JobFormData) => api.post<Job>('/jobs', jobData),
    onSuccess: (newJob) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      dispatch(addJob(newJob))
    },
    onError: (error: Error) => {
      dispatch(setError(error.message))
    },
  })
}

export const useUpdateJob = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: ({ id, ...data }: JobUpdateData) => 
      api.patch<Job>(`/jobs/${id}`, data),
    onSuccess: (updatedJob) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      dispatch(updateJob(updatedJob))
    },
    onError: (error: Error) => {
      dispatch(setError(error.message))
    },
  })
}

export const useDeleteJob = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: (id: number) => api.delete(`/jobs/${id}`),
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      dispatch(deleteJob(jobId))
    },
    onError: (error: Error) => {
      dispatch(setError(error.message))
    },
  })
}

export const useExportJobs = () => {
  return useMutation({
    mutationFn: () => api.exportJobs(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `jobs-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    },
  })
} 