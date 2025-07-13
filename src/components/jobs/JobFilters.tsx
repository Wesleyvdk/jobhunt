'use client'

import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { setFilters, clearFilters } from '@/lib/slices/uiSlice'
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function JobFilters() {
    const dispatch = useAppDispatch()
    const filters = useAppSelector((state) => state.ui.filters)
    const [isExpanded, setIsExpanded] = useState(false)

    const statusOptions = [
        { value: 'All', label: 'All Statuses', color: 'gray' },
        { value: 'Prospect', label: 'Prospect', color: 'blue' },
        { value: 'Invited', label: 'Invited', color: 'yellow' },
        { value: 'Interviewed', label: 'Interviewed', color: 'purple' },
        { value: 'Hired', label: 'Hired', color: 'green' },
        { value: 'Rejected', label: 'Rejected', color: 'red' }
    ]

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        dispatch(setFilters({ [key]: value }))
    }

    const handleClearFilters = () => {
        dispatch(clearFilters())
    }

    const hasActiveFilters = filters.search || filters.status !== 'All' || filters.dateFrom || filters.dateTo

    return (
        <div className="glass-card mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <FunnelIcon className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-lg font-semibold text-white">Filters</h3>
                    {hasActiveFilters && (
                        <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                            Active
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="btn-secondary text-xs flex items-center gap-1"
                        >
                            <XMarkIcon className="h-4 w-4" />
                            Clear
                        </button>
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="btn-secondary text-xs"
                    >
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search company or position..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 text-sm appearance-none cursor-pointer"
                    >
                        {statusOptions.map((status) => (
                            <option key={status.value} value={status.value} className="bg-gray-800">
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date From */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm"
                        placeholder="From date"
                    />
                </div>

                {/* Date To */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-indigo-400" />
                    </div>
                    <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm"
                        placeholder="To date"
                    />
                </div>
            </div>

            {/* Status Pills (when expanded) */}
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-indigo-500/20">
                    <p className="text-sm text-white/60 mb-3">Quick Status Filter:</p>
                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map((status) => (
                            <button
                                key={status.value}
                                onClick={() => handleFilterChange('status', status.value)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filters.status === status.value
                                        ? `status-${status.value.toLowerCase()} ring-2 ring-current`
                                        : 'bg-white/10 text-white/60 hover:bg-white/15'
                                    }`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}