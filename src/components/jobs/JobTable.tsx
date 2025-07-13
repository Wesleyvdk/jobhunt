'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { openJobModal, setSorting, setSelectedJobId } from '@/lib/slices/uiSlice'
import { useDeleteJob, useExportJobs } from '@/lib/hooks/useJobs'
import { Job } from '@/lib/slices/jobsSlice'
import {
    PencilIcon,
    TrashIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    LinkIcon,
    DocumentArrowDownIcon,
    EyeIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

type sortByState = 'company' | 'position' | 'applicationDate' | 'status'

export default function JobTable() {
    const dispatch = useAppDispatch()
    const jobs = useAppSelector((state) => state.jobs.jobs as Job[])
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

        // Sort logic remains the same
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

    const handleSort = (column: string) => {
        if (sortBy === column) {
            dispatch(setSorting({ sortBy: column, sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' }))
        } else {
            dispatch(setSorting({ sortBy: column as sortByState, sortOrder: 'asc' }))
        }
    }

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            'Open': 'status-open',
            'Invited': 'status-invited',
            'Interviewed': 'status-interviewed',
            'Hired': 'status-hired',
            'Rejected': 'status-rejected'
        }

        return (
            <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses] || 'status-open'}`}>
                {status}
            </span>
        )
    }

    if (isLoading) {
        return (
            <div className="table-container">
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                    <p className="mt-2 text-white/60">Loading jobs...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="table-container">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-indigo-500/20">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">Job Applications</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-white/60">
                            {filteredAndSortedJobs.length} of {jobs.length} jobs
                        </span>
                        <button
                            onClick={() => exportJobsMutation.mutate()}
                            className="btn-secondary flex items-center gap-2 text-xs"
                        >
                            <DocumentArrowDownIcon className="h-4 w-4" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-indigo-500/20">
                            {[
                                { key: 'company', label: 'Company' },
                                { key: 'position', label: 'Position' },
                                { key: 'applicationDate', label: 'Applied' },
                                { key: 'status', label: 'Status' },
                                { key: 'actions', label: 'Actions', sortable: false }
                            ].map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-4 text-left text-sm font-medium text-white/80 ${column.sortable !== false ? 'cursor-pointer hover:text-white' : ''
                                        }`}
                                    onClick={() => column.sortable !== false && handleSort(column.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {column.sortable !== false && sortBy === column.key && (
                                            sortOrder === 'asc' ?
                                                <ArrowUpIcon className="h-4 w-4 text-indigo-400" /> :
                                                <ArrowDownIcon className="h-4 w-4 text-indigo-400" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedJobs.map((job, index) => (
                            <tr
                                key={job.id}
                                className="table-row group"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                            {job.company.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{job.company}</p>
                                            {job.jobLink && (
                                                <a
                                                    href={job.jobLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1"
                                                >
                                                    <LinkIcon className="h-3 w-3" />
                                                    View Job
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-white">{job.position}</p>
                                    {job.notes && (
                                        <p className="text-xs text-white/60 mt-1 truncate max-w-xs">
                                            {job.notes}
                                        </p>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-white">
                                        {format(new Date(job.applicationDate), 'MMM dd, yyyy')}
                                    </p>
                                    {job.followUpDate && (
                                        <p className="text-xs text-yellow-400 mt-1">
                                            Follow up: {format(new Date(job.followUpDate), 'MMM dd')}
                                        </p>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(job.status)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                dispatch(setSelectedJobId(job.id))
                                                dispatch(openJobModal())
                                            }}
                                            className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                                            title="Edit"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteJobMutation.mutate(job.id.toString())}
                                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                            title="Delete"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredAndSortedJobs.length === 0 && (
                <div className="p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-white mb-2">No jobs found</h3>
                    <p className="text-white/60 mb-4">Try adjusting your filters or add a new job application.</p>
                    <button
                        onClick={() => dispatch(openJobModal())}
                        className="btn-primary"
                    >
                        Add Your First Job
                    </button>
                </div>
            )}
        </div>
    )
}