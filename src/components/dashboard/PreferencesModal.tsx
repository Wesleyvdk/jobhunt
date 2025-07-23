'use client'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/store'
import {
    updateDashboardLayout,
    updateNotifications,
    updateDateTime,
    updateExportSettings,
    updateTheme,
    updateAccount,
    loadPreferences
} from '@/lib/slices/preferencesSlice'
import { XMarkIcon, Cog6ToothIcon, BellIcon, CalendarIcon, DocumentArrowDownIcon, PaintBrushIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

interface PreferencesModalProps {
    isOpen: boolean
    onClose: () => void
}

type TabType = 'dashboard' | 'notifications' | 'display' | 'export' | 'theme' | 'account'

export default function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
    const dispatch = useDispatch<AppDispatch>()
    const preferences = useSelector((state: RootState) => state.preferences)
    const [activeTab, setActiveTab] = useState<TabType>('dashboard')
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [originalPreferences, setOriginalPreferences] = useState<any>(null)
    const [hasChanges, setHasChanges] = useState(false)

    useEffect(() => {
        if (isOpen) {
            loadUserPreferences()
        }
    }, [isOpen])

    useEffect(() => {
        if (originalPreferences) {
            const currentPrefs = JSON.stringify(preferences)
            const originalPrefs = JSON.stringify(originalPreferences)
            setHasChanges(currentPrefs !== originalPrefs)
        }
    }, [preferences, originalPreferences])

    const loadUserPreferences = async () => {
        setIsLoading(true)
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
                        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                        firstDayOfWeek: data.firstDayOfWeek || 'sunday'
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
                        sessionTimeout: data.sessionTimeout || 60,
                        dataRetention: data.dataRetention || 365,
                        autoBackup: data.autoBackup ?? true
                    }
                }
                dispatch(loadPreferences(transformedPrefs))
                setOriginalPreferences(JSON.parse(JSON.stringify(transformedPrefs)))
                setHasChanges(false)
            }
        } catch (error) {
            console.error('Failed to load preferences:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const savePreferences = async () => {
        setIsSaving(true)
        try {
            const dbFormat = {
                defaultView: preferences.dashboardLayout.defaultView,
                itemsPerPage: preferences.dashboardLayout.itemsPerPage,
                showCompletedJobs: preferences.dashboardLayout.showCompletedJobs,
                compactMode: preferences.dashboardLayout.compactMode,
                emailNotifications: preferences.notifications.emailNotifications,
                followUpReminders: preferences.notifications.followUpReminders,
                applicationDeadlines: preferences.notifications.applicationDeadlines,
                weeklyReports: preferences.notifications.weeklyReports,
                pushNotifications: preferences.notifications.pushNotifications,
                dateFormat: preferences.dateTime.dateFormat,
                timeFormat: preferences.dateTime.timeFormat,
                timezone: preferences.dateTime.timezone,
                firstDayOfWeek: preferences.dateTime.firstDayOfWeek,
                defaultExportFormat: preferences.exportSettings.defaultFormat,
                includeNotes: preferences.exportSettings.includeNotes,
                includePrivateFields: preferences.exportSettings.includePrivateFields,
                exportDateRange: preferences.exportSettings.dateRange,
                themeMode: preferences.theme.mode,
                accentColor: preferences.theme.accentColor,
                fontSize: preferences.theme.fontSize,
                reducedMotion: preferences.theme.reducedMotion,
                twoFactorEnabled: preferences.account.twoFactorEnabled,
                sessionTimeout: preferences.account.sessionTimeout,
                dataRetention: preferences.account.dataRetention,
                autoBackup: preferences.account.autoBackup
            }

            const response = await fetch('/api/preferences', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dbFormat)
            })

            if (response.ok) {
                setOriginalPreferences(JSON.parse(JSON.stringify(preferences)))
                setHasChanges(false)
                onClose()
            }
        } catch (error) {
            console.error('Error saving preferences:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleClose = () => {
        if (hasChanges) {
            const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close without saving?')
            if (!confirmClose) return
        }
        setHasChanges(false)
        setOriginalPreferences(null)
        onClose()
    }

    const tabs = [
        { id: 'dashboard' as TabType, label: 'Dashboard', icon: Cog6ToothIcon },
        { id: 'notifications' as TabType, label: 'Notifications', icon: BellIcon },
        { id: 'display' as TabType, label: 'Date & Time', icon: CalendarIcon },
        { id: 'export' as TabType, label: 'Export', icon: DocumentArrowDownIcon },
        { id: 'theme' as TabType, label: 'Theme', icon: PaintBrushIcon },
        { id: 'account' as TabType, label: 'Account', icon: ShieldCheckIcon }
    ]

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="glass-panel p-0 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-600/30 flex-shrink-0">
                        <h2 className="text-2xl font-bold accent">Preferences</h2>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-1 min-h-0">
                        {/* Sidebar */}
                        <div className="w-64 border-r border-slate-600/30 p-4 flex-shrink-0">
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeTab === tab.id
                                                ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300'
                                                : 'hover:bg-slate-700/30 text-slate-300 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    )
                                })}
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-slate-400">Loading preferences...</div>
                                </div>
                            ) : (
                                <>
                                    {activeTab === 'dashboard' && (
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-semibold text-white mb-4">Dashboard Layout</h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                                        Default View
                                                    </label>
                                                    <select
                                                        value={preferences.dashboardLayout.defaultView}
                                                        onChange={(e) => dispatch(updateDashboardLayout({
                                                            defaultView: e.target.value as 'kanban' | 'table' | 'grid'
                                                        }))}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200"
                                                    >
                                                        <option value="kanban">Kanban Board</option>
                                                        <option value="table">Table View</option>
                                                        <option value="grid">Grid View</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                                        Items Per Page
                                                    </label>
                                                    <select
                                                        value={preferences.dashboardLayout.itemsPerPage}
                                                        onChange={(e) => dispatch(updateDashboardLayout({
                                                            itemsPerPage: parseInt(e.target.value)
                                                        }))}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200"
                                                    >
                                                        <option value={5}>5</option>
                                                        <option value={10}>10</option>
                                                        <option value={25}>25</option>
                                                        <option value={50}>50</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="block text-sm font-medium text-slate-300">
                                                        Display Options
                                                    </label>

                                                    {[
                                                        { key: 'showCompletedJobs', label: 'Show Completed Jobs' },
                                                        { key: 'compactMode', label: 'Compact Mode' }
                                                    ].map((option) => (
                                                        <label key={option.key} className="flex items-center gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={preferences.dashboardLayout[option.key as keyof typeof preferences.dashboardLayout] as boolean}
                                                                onChange={(e) => dispatch(updateDashboardLayout({
                                                                    [option.key]: e.target.checked
                                                                }))}
                                                                className="rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <span className="text-slate-300">{option.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'notifications' && (
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-semibold text-white mb-4">Notification Settings</h3>

                                            <div className="space-y-4">
                                                {[
                                                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Get email notifications for important updates' },
                                                    { key: 'followUpReminders', label: 'Follow-up Reminders', desc: 'Reminders when it\'s time to follow up on applications' },
                                                    { key: 'applicationDeadlines', label: 'Application Deadlines', desc: 'Notifications for upcoming application deadlines' },
                                                    { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Summary of your job hunting activity' },
                                                    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' }
                                                ].map((notification) => (
                                                    <div key={notification.key} className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/30">
                                                        <input
                                                            type="checkbox"
                                                            checked={preferences.notifications[notification.key as keyof typeof preferences.notifications]}
                                                            onChange={(e) => dispatch(updateNotifications({
                                                                [notification.key]: e.target.checked
                                                            }))}
                                                            className="mt-1 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <div>
                                                            <label className="block font-medium text-white">{notification.label}</label>
                                                            <p className="text-sm text-slate-400">{notification.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'display' && (
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-semibold text-white mb-4">Date & Time Format</h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                                        Date Format
                                                    </label>
                                                    <select
                                                        value={preferences.dateTime.dateFormat}
                                                        onChange={(e) => dispatch(updateDateTime({
                                                            dateFormat: e.target.value as 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
                                                        }))}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200"
                                                    >
                                                        <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                                                        <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                                                        <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                                        Time Format
                                                    </label>
                                                    <select
                                                        value={preferences.dateTime.timeFormat}
                                                        onChange={(e) => dispatch(updateDateTime({
                                                            timeFormat: e.target.value as '12h' | '24h'
                                                        }))}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200"
                                                    >
                                                        <option value="12h">12-hour (2:30 PM)</option>
                                                        <option value="24h">24-hour (14:30)</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                                        First Day of Week
                                                    </label>
                                                    <select
                                                        value={preferences.dateTime.firstDayOfWeek}
                                                        onChange={(e) => dispatch(updateDateTime({
                                                            firstDayOfWeek: e.target.value as 'sunday' | 'monday'
                                                        }))}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200"
                                                    >
                                                        <option value="sunday">Sunday</option>
                                                        <option value="monday">Monday</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'export' && (
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-semibold text-white mb-4">Export Settings</h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                                        Default Export Format
                                                    </label>
                                                    <select
                                                        value={preferences.exportSettings.defaultFormat}
                                                        onChange={(e) => dispatch(updateExportSettings({
                                                            defaultFormat: e.target.value as 'csv' | 'excel' | 'pdf'
                                                        }))}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200"
                                                    >
                                                        <option value="csv">CSV (.csv)</option>
                                                        <option value="excel">Excel (.xlsx)</option>
                                                        <option value="pdf">PDF (.pdf)</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                                        Default Date Range
                                                    </label>
                                                    <select
                                                        value={preferences.exportSettings.dateRange}
                                                        onChange={(e) => dispatch(updateExportSettings({
                                                            dateRange: e.target.value as 'all' | 'last30' | 'last90' | 'custom'
                                                        }))}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200"
                                                    >
                                                        <option value="all">All Time</option>
                                                        <option value="last30">Last 30 Days</option>
                                                        <option value="last90">Last 90 Days</option>
                                                        <option value="custom">Custom Range</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="block text-sm font-medium text-slate-300">
                                                        Include in Export
                                                    </label>

                                                    {[
                                                        { key: 'includeNotes', label: 'Application Notes' },
                                                        { key: 'includePrivateFields', label: 'Private Fields' }
                                                    ].map((option) => (
                                                        <label key={option.key} className="flex items-center gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={preferences.exportSettings[option.key as keyof typeof preferences.exportSettings] as boolean}
                                                                onChange={(e) => dispatch(updateExportSettings({
                                                                    [option.key]: e.target.checked
                                                                }))}
                                                                className="rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <span className="text-slate-300">{option.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'theme' && (
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-semibold text-white mb-4">Theme Settings</h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                                        Appearance
                                                    </label>
                                                    <select
                                                        value={preferences.theme.mode}
                                                        onChange={(e) => dispatch(updateTheme({
                                                            mode: e.target.value as 'light' | 'dark' | 'system'
                                                        }))}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200"
                                                    >
                                                        <option value="dark">Dark Mode</option>
                                                        <option value="light">Light Mode</option>
                                                        <option value="system">System Default</option>
                                                    </select>
                                                    <p className="text-sm text-slate-400 mt-2">
                                                        Choose your preferred color scheme. System default will match your device settings.
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                                        Accent Color
                                                    </label>
                                                    <select
                                                        value={preferences.theme?.accentColor || 'indigo'}
                                                        onChange={(e) => dispatch(updateTheme({
                                                            ...preferences.theme,
                                                            accentColor: e.target.value as 'indigo' | 'blue' | 'emerald' | 'rose'
                                                        }))}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200"
                                                    >
                                                        <option value="indigo">Indigo</option>
                                                        <option value="blue">Blue</option>
                                                        <option value="emerald">Emerald</option>
                                                        <option value="rose">Rose</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                                        Font Size
                                                    </label>
                                                    <select
                                                        value={preferences.theme.fontSize}
                                                        onChange={(e) => dispatch(updateTheme({
                                                            fontSize: e.target.value as 'small' | 'medium' | 'large'
                                                        }))}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200"
                                                    >
                                                        <option value="small">Small</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="large">Large</option>
                                                    </select>
                                                </div>

                                                <label className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={preferences.theme.reducedMotion}
                                                        onChange={(e) => dispatch(updateTheme({
                                                            reducedMotion: e.target.checked
                                                        }))}
                                                        className="rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span className="text-slate-300">Reduce Motion</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'account' && (
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-semibold text-white mb-4">Account Settings</h3>

                                            <div className="space-y-6">
                                                {/* Security Settings */}
                                                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-600/30">
                                                    <h4 className="font-semibold text-white mb-3">Security</h4>
                                                    <div className="space-y-3">
                                                        <label className="flex items-center gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={preferences.account.twoFactorEnabled}
                                                                onChange={(e) => dispatch(updateAccount({
                                                                    twoFactorEnabled: e.target.checked
                                                                }))}
                                                                className="rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <span className="text-slate-300">Enable Two-Factor Authentication</span>
                                                        </label>

                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                                Session Timeout (minutes)
                                                            </label>
                                                            <select
                                                                value={preferences.account.sessionTimeout}
                                                                onChange={(e) => dispatch(updateAccount({
                                                                    sessionTimeout: parseInt(e.target.value)
                                                                }))}
                                                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200"
                                                            >
                                                                <option value={30}>30 minutes</option>
                                                                <option value={60}>1 hour</option>
                                                                <option value={120}>2 hours</option>
                                                                <option value={480}>8 hours</option>
                                                                <option value={1440}>24 hours</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Data Management */}
                                                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-600/30">
                                                    <h4 className="font-semibold text-white mb-3">Data Management</h4>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                                                Data Retention (days)
                                                            </label>
                                                            <select
                                                                value={preferences.account.dataRetention}
                                                                onChange={(e) => dispatch(updateAccount({
                                                                    dataRetention: parseInt(e.target.value)
                                                                }))}
                                                                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all duration-200"
                                                            >
                                                                <option value={90}>90 days</option>
                                                                <option value={180}>6 months</option>
                                                                <option value={365}>1 year</option>
                                                                <option value={730}>2 years</option>
                                                                <option value={-1}>Forever</option>
                                                            </select>
                                                        </div>

                                                        <label className="flex items-center gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={preferences.account.autoBackup}
                                                                onChange={(e) => dispatch(updateAccount({
                                                                    autoBackup: e.target.checked
                                                                }))}
                                                                className="rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <span className="text-slate-300">Enable Auto Backup</span>
                                                        </label>

                                                        <div className="border-t border-slate-600/30 pt-3 mt-4">
                                                            <button className="w-full px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors">
                                                                Delete Account
                                                            </button>
                                                            <p className="text-xs text-slate-400 mt-2">
                                                                This action cannot be undone. All your data will be permanently deleted.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-600/30">
                        <div className="flex items-center gap-2">
                            {hasChanges && (
                                <span className="text-sm text-amber-400 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    Unsaved changes
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleClose}
                                className="btn-secondary"
                                disabled={isSaving}
                            >
                                {hasChanges ? 'Cancel' : 'Close'}
                            </button>
                            {hasChanges && (
                                <button
                                    onClick={savePreferences}
                                    className="btn-primary"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}