'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { openJobModal, setSorting } from '@/lib/slices/uiSlice'
import { useDeleteJob, useExportJobs } from '@/lib/hooks/useJobs'
import { Job } from '@/lib/slices/jobsSlice'
import {
    PencilIcon,
    TrashIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    LinkIcon,
    DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

export default function JobTable() {
    const dispatch = useAppDispatch()
    const jobs = useAppSelector((state) => state.jobs.jobs) as Job[]
    const filters = useAppSelector((state) => state.ui.filters)
    const sortBy = useAppSelector((state) => state.ui.sortBy)
    const sortOrder = useAppSelector((state) => state.ui.sortOrder)
    const isLoading = useAppSelector((state) => state.jobs.isLoading)

    const deleteJobMutation = useDeleteJob()
    const exportJobsMutation = useExportJobs()

    const filteredAndSortedJobs = useMemo(() => {
        let filtered = jobs.filter((job) => {
            const matchesSearch =
                job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
                job.position.toLowerCase().includes(filters.search.toLowerCase())

            const matchesStatus = filters.status === 'All' || job.status === filters.status

            const matchesDateRange =
                (!filters.dateFrom || job.applicationDate >= filters.dateFrom) &&
                (!filters.dateTo || job.applicationDate <= filters.dateTo)

            return matchesSearch && matchesStatus && matchesDateRange
        })

        // Sort
        filtered.sort((a, b) => {
            let aValue: any = a[sortBy]
            let bValue: any = b[sortBy]

            if (sortBy === 'applicationDate') {
                aValue = new Date(aValue)
                bValue = new Date(bValue)
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase()
                bValue = bValue.toLowerCase()
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
            return 0
        })

        return filtered
    }, [jobs, filters, sortBy, sortOrder])

    const handleSort = (column: typeof sortBy) => {
        const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc'
        dispatch(setSorting({ sortBy: column, sortOrder: newOrder }))
    }

    const handleEdit = (job: Job) => {
        dispatch(openJobModal(job.id))
    }

    const handleDelete = async (jobId: string) => {
        if (window.confirm('Are you sure you want to delete this job application?')) {
            deleteJobMutation.mutate(jobId)
        }
    }

    const handleExport = () => {
        exportJobsMutation.mutate()
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            Open: 'bg-yellow-100 text-yellow-800',
            Rejected: 'bg-red-100 text-red-800',
            Invited: 'bg-blue-100 text-blue-800',
            Interviewed: 'bg-indigo-100 text-indigo-800',
            Hired: 'bg-green-100 text-green-800',
        }

        return (
            <span className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
            )}>
                {status}
            </span>
        )
    }

    const SortButton = ({ column, children }: { column: typeof sortBy; children: React.ReactNode }) => (
        <button
            onClick={() => handleSort(column)}
            className="group inline-flex items-center font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
        >
            {children}
            <span className="ml-1 flex-none rounded text-gray-400">
                {sortBy === column ? (
                    sortOrder === 'asc' ? (
                        <ArrowUpIcon className="h-4 w-4" />
                    ) : (
                        <ArrowDownIcon className="h-4 w-4" />
                    )
                ) : (
                    <ArrowUpIcon className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                )}
            </span>
        </button>
    )

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="sm:flex sm:items-center mb-6">
                <div className="sm:flex-auto">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Job Applications ({filteredAndSortedJobs.length})
                    </h3>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={handleExport}
                        disabled={exportJobsMutation.isPending}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                        {exportJobsMutation.isPending ? 'Exporting...' : 'Export CSV'}
                    </button>
                </div>
            </div>

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <SortButton column="company">Company</SortButton>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <SortButton column="position">Position</SortButton>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <SortButton column="applicationDate">Applied</SortButton>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <SortButton column="status">Status</SortButton>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Notes
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                        {filteredAndSortedJobs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No job applications found. Start by adding your first application!
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {job.company}
                                                </div>
                                                {job.jobLink && (
                                                    <a
                                                        href={job.jobLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:text-indigo-900 text-xs flex items-center mt-1"
                                                    >
                                                        <LinkIcon className="h-3 w-3 mr-1" />
                                                        View Job
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {job.position}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {format(new Date(job.applicationDate), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(job.status)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                        {job.notes || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(job)}
                                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(job.id)}
                                                disabled={deleteJobMutation.isPending}
                                                className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
} 