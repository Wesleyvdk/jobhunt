'use client'

import { useSession, signOut } from 'next-auth/react'
import { useAppDispatch } from '@/lib/hooks'
import { openJobModal } from '@/lib/slices/uiSlice'
import { PlusIcon, ChevronDownIcon, UserIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useState, useRef, useEffect } from 'react'
import JobImport from '@/components/jobs/JobImport'
import PreferencesModal from '@/components/dashboard/PreferencesModal'

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { data: session } = useSession()
    const dispatch = useAppDispatch()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isImportOpen, setIsImportOpen] = useState(false)
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
    const profileRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleAddJob = () => {
        dispatch(openJobModal())
    }

    const handleImport = () => {
        setIsImportOpen(true)
    }

    const handlePreferences = () => {
        setIsProfileOpen(false)
        setIsPreferencesOpen(true)
    }

    const handleSignOut = async () => {
        setIsProfileOpen(false)
        await signOut({ callbackUrl: '/auth/signin' })
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#181c2b] via-[#181a2f] to-[#0f1123]">
            {/* Topbar */}
            <header className="glass-panel flex items-center justify-between px-6 py-4 mb-10 mt-4 mx-auto z-50 w-full max-w-6xl rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-700 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold accent">T</span>
                    </div>
                    <span className="text-xl font-bold accent tracking-wide">Treffortly Job Hunting</span>
                </div>

                <div className="flex items-center gap-3">
                    <input type="text" placeholder="Search jobs..." className="w-40 md:w-64" />

                    {/* Import Button */}
                    <button
                        onClick={handleImport}
                        className="btn-secondary flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <ArrowUpTrayIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Import</span>
                    </button>

                    {/* Add Job Button */}
                    <button
                        onClick={handleAddJob}
                        className="btn-accent flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Add Job</span>
                    </button>

                    {/* Profile Dropdown - Enhanced */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-2 rounded-xl bg-indigo-700/20 border border-indigo-500/30 hover:bg-indigo-700/30 transition-all relative z-[60]"
                        >
                            <div className="h-8 w-8 rounded-full bg-indigo-700 flex items-center justify-center shadow-lg">
                                <span className="text-sm font-bold text-white">
                                    {session?.user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <ChevronDownIcon className={`h-4 w-4 text-indigo-300 transition-transform ${isProfileOpen ? 'rotate-180' : ''
                                }`} />
                        </button>

                        {/* Dropdown Menu - Fixed Layering */}
                        {isProfileOpen && (
                            <>
                                {/* Invisible overlay to ensure proper layering */}
                                <div className="fixed inset-0 z-[100]" onClick={() => setIsProfileOpen(false)} />
                                <div className="absolute right-0 mt-3 w-72 backdrop-blur-xl bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-slate-600/30 rounded-2xl shadow-2xl z-[101] overflow-hidden">
                                    {/* Neumorphistic container with inset shadow */}
                                    <div className="bg-gradient-to-br from-slate-700/20 to-slate-800/40 backdrop-blur-sm">
                                        {/* User Info */}
                                        <div className="px-5 py-4 border-b border-slate-600/30">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-indigo-400/30">
                                                    <span className="text-lg font-bold text-white">
                                                        {session?.user?.name?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white text-sm">{session?.user?.name || 'User'}</p>
                                                    <p className="text-xs text-slate-300">{session?.user?.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items with Neumorphistic buttons */}
                                        <div className="py-3 px-2">
                                            <button
                                                onClick={handlePreferences}
                                                className="w-full px-4 py-3 text-left flex items-center gap-3 text-slate-200 hover:text-white rounded-xl hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50 transition-all duration-200 group"
                                            >
                                                <div className="p-1.5 rounded-lg bg-slate-700/50 group-hover:bg-slate-600/60 transition-colors">
                                                    <Cog6ToothIcon className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium">Preferences</span>
                                            </button>
                                            <div className="my-2 mx-3 h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent"></div>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full px-4 py-3 text-left flex items-center gap-3 text-red-300 hover:text-red-200 rounded-xl hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/30 transition-all duration-200 group"
                                            >
                                                <div className="p-1.5 rounded-lg bg-red-900/30 group-hover:bg-red-800/40 transition-colors">
                                                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium">Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto px-2 md:px-0">
                {children}
            </main>

            {/* Import Modal */}
            {isImportOpen && (
                <JobImport
                    isOpen={isImportOpen}
                    onClose={() => setIsImportOpen(false)}
                />
            )}

            {/* Preferences Modal */}
            <PreferencesModal
                isOpen={isPreferencesOpen}
                onClose={() => setIsPreferencesOpen(false)}
            />
        </div>
    )
}