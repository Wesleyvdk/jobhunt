'use client'

import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { setFilters, clearFilters } from '@/lib/slices/uiSlice'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function JobFilters() {
    const dispatch = useAppDispatch()
    const filters = useAppSelector((state) => state.ui.filters)

    const statusOptions = ['All', 'Open', 'Rejected', 'Invited', 'Interviewed', 'Hired']

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        dispatch(setFilters({ [key]: value }))
    }

    const handleClearFilters = () => {
        dispatch(clearFilters())
    }

    const hasActiveFilters = filters.search || filters.status !== 'All' || filters.dateFrom || filters.dateTo

    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search company or position..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status === 'All' ? 'All Statuses' : status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date From */}
                    <div>
                        <input
                            type="date"
                            placeholder="From date"
                            value={filters.dateFrom}
                            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* Date To */}
                    <div>
                        <input
                            type="date"
                            placeholder="To date"
                            value={filters.dateTo}
                            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <div className="flex-shrink-0">
                        <button
                            onClick={handleClearFilters}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <XMarkIcon className="h-4 w-4 mr-2" />
                            Clear
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
} 