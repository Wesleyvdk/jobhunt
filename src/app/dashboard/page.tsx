'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import JobTable from '@/components/jobs/JobTable'
import JobModal from '@/components/jobs/JobModal'
import JobFilters from '@/components/jobs/JobFilters'
import JobStats from '@/components/jobs/JobStats'
import { useJobs } from '@/lib/hooks/useJobs'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { setJobs, setLoading, setError } from '@/lib/slices/jobsSlice'

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const dispatch = useAppDispatch()

    const { data: jobs, isLoading, error } = useJobs()
    const isJobModalOpen = useAppSelector((state) => state.ui.isJobModalOpen)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
    }, [status, router])

    useEffect(() => {
        if (jobs) {
            dispatch(setJobs(jobs))
        }
        if (isLoading) {
            dispatch(setLoading(isLoading))
        }
        if (error) {
            dispatch(setError(error.message))
        }
    }, [jobs, isLoading, error, dispatch])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    if (status === 'unauthenticated') {
        return null
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Statistics */}
                <JobStats />

                {/* Filters */}
                <JobFilters />

                {/* Jobs Table */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <JobTable />
                </div>

                {/* Job Modal */}
                {isJobModalOpen && <JobModal />}
            </div>
        </DashboardLayout>
    )
} 