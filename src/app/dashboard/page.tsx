'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import JobTable from '@/components/jobs/JobTable'
import JobModal from '@/components/jobs/JobModal'
import JobKanbanBoard from '@/components/jobs/JobKanbanBoard'
import ViewToggle from '@/components/jobs/ViewToggle'
import ApplicationsChart from '@/components/charts/ApplicationsChart'
import StatusChart from '@/components/charts/StatusChart'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'
import { useJobs } from '@/lib/hooks/useJobs'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { setJobs, setLoading, setError, updateJob } from '@/lib/slices/jobsSlice'
import { api } from '@/lib/api'
import { Job } from '@/lib/slices/jobsSlice'
import { JobStatus } from '@/lib/slices/uiSlice'

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [showOnboarding, setShowOnboarding] = useState(false)
    const [onboardingLoading, setOnboardingLoading] = useState(true)

    const { data: apiJobs, isLoading, error } = useJobs()
    const jobs = useAppSelector((state) => state.jobs.jobs)
    const isJobModalOpen = useAppSelector((state) => state.ui.isJobModalOpen)
    const [view, setView] = useState<'table' | 'kanban'>('table')

    useEffect(() => {
        const checkOnboarding = async () => {
            if (status === 'authenticated') {
                try {
                    const response = await fetch('/api/onboarding')
                    if (response.ok) {
                        const data = await response.json()
                        setShowOnboarding(!data.completed)
                    }
                } catch (error) {
                    console.error('Failed to check onboarding status:', error)
                } finally {
                    setOnboardingLoading(false)
                }
            }
        }

        checkOnboarding()
    }, [status])

    const stats = useMemo(() => {
        const total = jobs?.length || 0
        const byStatus = {
            Prospect: 0,
            Applied: 0,
            Interviewed: 0,
            Rejected: 0,
            Hired: 0,
            Ghosted: 0,
        }
        let interviews = 0
        let offers = 0
        let followUps: any[] = []
        let recent: any[] = []
        if (jobs) {
            for (const job of jobs) {
                if (byStatus[job.status] !== undefined) byStatus[job.status]++
                if (job.status === 'Interviewed') interviews++
                if (job.status === 'Hired') offers++
                if (job.followUpDate && new Date(job.followUpDate) > new Date()) followUps.push(job)
            }
            recent = [...jobs].sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()).slice(0, 5)
            followUps = followUps.sort((a, b) => new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime()).slice(0, 5)
        }
        return { total, byStatus, interviews, offers, followUps, recent }
    }, [jobs])

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
    }, [status, router])

    useEffect(() => {
        if (apiJobs) {
            dispatch(setJobs(apiJobs))
        }
        if (isLoading) {
            dispatch(setLoading(isLoading))
        }
        if (error) {
            dispatch(setError(error.message))
        }
    }, [apiJobs, isLoading, error, dispatch])

    const handleStatusChange = async (jobId: number, newStatus: string) => {
        const job = jobs?.find(j => j.id === jobId)
        if (!job) return

        dispatch(updateJob({ ...job, status: newStatus as JobStatus }))

        try {
            const updated = await api.patch<Job>(`/jobs/${jobId}`, { status: newStatus })
            dispatch(updateJob(updated))
        } catch (err) {
            dispatch(updateJob(job))
            dispatch(setError('Failed to update job status'))
        }
    }

    if (status === 'loading' || onboardingLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    if (status === 'unauthenticated') {
        router.push('/auth/signin')
        return null
    }

    if (showOnboarding) {
        return (
            <OnboardingFlow
                onComplete={() => {
                    setShowOnboarding(false)
                    window.location.reload()
                }}
            />
        )
    }

    return (
        <>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="glass-panel p-6">
                            <h3 className="text-lg font-semibold text-white mb-2">Total Applications</h3>
                            <p className="text-3xl font-bold text-white">{stats.total}</p>
                        </div>
                        <div className="glass-panel p-6">
                            <h3 className="text-lg font-semibold text-white mb-2">Applied</h3>
                            <p className="text-3xl font-bold text-yellow-400">{stats.byStatus.Applied}</p>
                        </div>
                        <div className="glass-panel p-6">
                            <h3 className="text-lg font-semibold text-white mb-2">Interviews</h3>
                            <p className="text-3xl font-bold text-purple-400">{stats.byStatus.Interviewed}</p>
                        </div>
                        <div className="glass-panel p-6">
                            <h3 className="text-lg font-semibold text-white mb-2">Hired</h3>
                            <p className="text-3xl font-bold text-green-400">{stats.byStatus.Hired}</p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass-panel p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Applications Over Time</h2>
                            <ApplicationsChart jobs={jobs || []} />
                        </div>
                        <div className="glass-panel p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Status Breakdown</h2>
                            <StatusChart jobs={jobs || []} />
                        </div>
                    </div>

                    {/* Jobs View */}
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">Job Applications</h2>
                            <ViewToggle value={view} onChange={setView} />
                        </div>

                        {view === 'table' ? (
                            <JobTable />
                        ) : (
                            <JobKanbanBoard
                                jobs={jobs || []}
                                onStatusChange={handleStatusChange}
                            />
                        )}
                    </div>
                </div>
            </DashboardLayout>

            {isJobModalOpen && <JobModal />}
        </>
    )
}