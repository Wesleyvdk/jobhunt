'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/lib/store'
import { loadPreferences } from '@/lib/slices/preferencesSlice'

export function PreferencesLoader({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        const loadUserPreferences = async () => {
            if (status === 'authenticated' && session?.user?.email) {
                try {
                    const response = await fetch('/api/preferences')
                    if (response.ok) {
                        const data = await response.json()
                        const transformedPrefs = {
                            dashboardLayout: {
                                defaultView: data.defaultView || 'kanban',
                                itemsPerPage: data.itemsPerPage || 10,
                                showCompletedJobs: data.showCompletedJobs ?? true,
                                compactMode: data.compactMode ?? false
                            },
                            notifications: {
                                emailNotifications: data.emailNotifications ?? true,
                                followUpReminders: data.followUpReminders ?? true,
                                applicationDeadlines: data.applicationDeadlines ?? true,
                                weeklyReports: data.weeklyReports ?? false,
                                pushNotifications: data.pushNotifications ?? false
                            },
                            dateTime: {
                                dateFormat: data.dateFormat || 'MM/DD/YYYY',
                                timeFormat: data.timeFormat || '12h',
                                timezone: data.timezone || 'UTC',
                                firstDayOfWeek: data.firstDayOfWeek || 'monday'
                            },
                            exportSettings: {
                                defaultFormat: data.defaultExportFormat || 'csv',
                                includeNotes: data.includeNotes ?? true,
                                includePrivateFields: data.includePrivateFields ?? false,
                                dateRange: data.exportDateRange || 'all'
                            },
                            theme: {
                                mode: data.themeMode || 'system',
                                accentColor: data.accentColor || 'indigo',
                                fontSize: data.fontSize || 'medium',
                                reducedMotion: data.reducedMotion ?? false
                            },
                            account: {
                                twoFactorEnabled: data.twoFactorEnabled ?? false,
                                sessionTimeout: data.sessionTimeout || 30,
                                dataRetention: data.dataRetention || 365,
                                autoBackup: data.autoBackup ?? false
                            }
                        }

                        dispatch(loadPreferences(transformedPrefs))
                    }
                } catch (error) {
                    console.error('Failed to load user preferences:', error)
                }
            }
        }

        loadUserPreferences()
    }, [status, session?.user?.email, dispatch])

    return <>{children}</>
}