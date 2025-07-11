'use client'

import { useAppSelector } from '@/lib/hooks'
import { Job } from '@/lib/slices/jobsSlice'

export default function JobStats() {
    const jobs = useAppSelector((state) => state.jobs.jobs as Job[])

    const stats = {
        total: jobs.length,
        open: jobs.filter((job) => job.status === 'Open').length,
        interviewed: jobs.filter((job) => job.status === 'Interviewed').length,
        hired: jobs.filter((job) => job.status === 'Hired').length,
        rejected: jobs.filter((job) => job.status === 'Rejected').length,
    }

    const statCards = [
        {
            name: 'Total Applications',
            value: stats.total,
            icon: '📋',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            name: 'Open Applications',
            value: stats.open,
            icon: '🔍',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            name: 'Interviews',
            value: stats.interviewed,
            icon: '💼',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
        {
            name: 'Hired',
            value: stats.hired,
            icon: '🎉',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            name: 'Rejected',
            value: stats.rejected,
            icon: '❌',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {statCards.map((stat) => (
                <div
                    key={stat.name}
                    className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:px-6 sm:py-6"
                >
                    <dt>
                        <div className={`absolute rounded-md p-3 ${stat.bgColor}`}>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                            {stat.name}
                        </p>
                    </dt>
                    <dd className="ml-16 flex items-baseline">
                        <p className={`text-2xl font-semibold ${stat.color}`}>
                            {stat.value}
                        </p>
                    </dd>
                </div>
            ))}
        </div>
    )
} 