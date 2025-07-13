'use client'

import { useAppSelector } from '@/lib/hooks'
import { Job } from '@/lib/slices/jobsSlice'
import { useMemo } from 'react'

export default function JobStats() {
    const jobs = useAppSelector((state) => state.jobs.jobs as Job[])

    const stats = useMemo(() => {
        const total = jobs.length
        const open = jobs.filter((job) => job.status === 'Prospect').length
        const interviewed = jobs.filter((job) => job.status === 'Interviewed').length
        const hired = jobs.filter((job) => job.status === 'Hired').length
        const rejected = jobs.filter((job) => job.status === 'Rejected').length

        const successRate = total > 0 ? ((hired / total) * 100).toFixed(1) : '0'
        const interviewRate = total > 0 ? (((interviewed + hired) / total) * 100).toFixed(1) : '0'

        return { total, open, interviewed, hired, rejected, successRate, interviewRate }
    }, [jobs])

    const statCards = [
        {
            name: 'Total Applications',
            value: stats.total,
            icon: '📋',
            gradient: 'from-blue-500 to-cyan-500',
            change: '+12%',
            changeType: 'positive'
        },
        {
            name: 'Active Applications',
            value: stats.open,
            icon: '🎯',
            gradient: 'from-yellow-500 to-orange-500',
            change: '+5%',
            changeType: 'positive'
        },
        {
            name: 'Interviews',
            value: stats.interviewed,
            icon: '💼',
            gradient: 'from-indigo-500 to-purple-500',
            change: `${stats.interviewRate}%`,
            changeType: 'neutral'
        },
        {
            name: 'Success Rate',
            value: `${stats.successRate}%`,
            icon: '🎉',
            gradient: 'from-green-500 to-emerald-500',
            change: '+2.1%',
            changeType: 'positive'
        },
        {
            name: 'Rejected',
            value: stats.rejected,
            icon: '📉',
            gradient: 'from-red-500 to-pink-500',
            change: '-8%',
            changeType: 'negative'
        },
    ]

    return (
        <div className="stats-grid mb-8">
            {statCards.map((stat, index) => (
                <div
                    key={stat.name}
                    className="glass-card group cursor-pointer relative overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${stat.changeType === 'positive' ? 'bg-green-500/20 text-green-400' :
                                stat.changeType === 'negative' ? 'bg-red-500/20 text-red-400' :
                                    'bg-gray-500/20 text-gray-400'
                                }`}>
                                {stat.change}
                            </div>
                        </div>

                        <div>
                            <p className="text-2xl font-bold text-white mb-1 group-hover:scale-105 transition-transform">
                                {stat.value}
                            </p>
                            <p className="text-sm text-white/60 font-medium">
                                {stat.name}
                            </p>
                        </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
            ))}
        </div>
    )
}