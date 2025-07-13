'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { closeJobModal } from '@/lib/slices/uiSlice'
import { useCreateJob, useUpdateJob } from '@/lib/hooks/useJobs'
import { jobSchema, JobFormData } from '@/lib/validations/job'
import { Job } from '@/lib/slices/jobsSlice'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function JobModal() {
    const dispatch = useAppDispatch()
    const selectedJobId = useAppSelector((state) => state.ui.selectedJobId)
    const jobs = useAppSelector((state) => state.jobs.jobs as Job[])

    const selectedJob = selectedJobId ? jobs.find(job => job.id === selectedJobId) : null
    const isEditing = !!selectedJob

    const createJobMutation = useCreateJob()
    const updateJobMutation = useUpdateJob()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            company: '',
            position: '',
            applicationDate: new Date().toISOString().split('T')[0],
            status: 'Prospect',
            notes: '',
            jobLink: '',
            followUpDate: '',
        },
    })

    useEffect(() => {
        if (selectedJob) {
            reset({
                company: selectedJob.company,
                position: selectedJob.position,
                applicationDate: selectedJob.applicationDate,
                status: selectedJob.status,
                notes: selectedJob.notes || '',
                jobLink: selectedJob.jobLink || '',
                followUpDate: selectedJob.followUpDate || '',
            })
        }
    }, [selectedJob, reset])

    const onSubmit = async (data: JobFormData) => {
        try {
            if (isEditing && selectedJob) {
                await updateJobMutation.mutateAsync({
                    id: selectedJob.id,
                    ...data,
                })
            } else {
                await createJobMutation.mutateAsync(data)
            }
            dispatch(closeJobModal())
            reset()
        } catch (error) {
            console.error('Error saving job:', error)
        }
    }

    const handleClose = () => {
        dispatch(closeJobModal())
        reset()
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-md bg-black/40 flex items-center justify-center px-4 py-8">
            <div className="glass-panel max-w-md w-full mx-auto relative p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">
                        {isEditing ? 'Edit Job Application' : 'Add Job Application'}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-200 p-1 rounded-lg hover:bg-white/10 transition-all"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Company *
                        </label>
                        <input
                            {...register('company')}
                            type="text"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="e.g., Google, Microsoft"
                        />
                        {errors.company && (
                            <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Position *
                        </label>
                        <input
                            {...register('position')}
                            type="text"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="e.g., Software Engineer, Product Manager"
                        />
                        {errors.position && (
                            <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Application Date *
                            </label>
                            <input
                                {...register('applicationDate')}
                                type="date"
                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                            {errors.applicationDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.applicationDate.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status *
                            </label>
                            <select
                                {...register('status')}
                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            >
                                <option value="Prospect">Prospect</option>
                                <option value="Applied">Applied</option>
                                <option value="Ghosted">Ghosted</option>
                                <option value="Interviewed">Interviewed</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Hired">Hired</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Job Link
                        </label>
                        <input
                            {...register('jobLink')}
                            type="url"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="https://company.com/jobs/123"
                        />
                        {errors.jobLink && (
                            <p className="mt-1 text-sm text-red-600">{errors.jobLink.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Follow-up Date
                        </label>
                        <input
                            {...register('followUpDate')}
                            type="date"
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                        {errors.followUpDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.followUpDate.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Notes
                        </label>
                        <textarea
                            {...register('notes')}
                            rows={3}
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder="Additional notes about this application..."
                        />
                        {errors.notes && (
                            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}