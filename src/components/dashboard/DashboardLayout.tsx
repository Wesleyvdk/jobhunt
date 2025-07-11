'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { toggleTheme, openJobModal } from '@/lib/slices/uiSlice'
import {
    HomeIcon,
    PlusIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    SunIcon,
    MoonIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { data: session } = useSession()
    const dispatch = useAppDispatch()
    const theme = useAppSelector((state) => state.ui.theme)

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
    }

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Add Job', action: () => dispatch(openJobModal(null)), icon: PlusIcon },
    ]

    return (
        <div className={theme}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Mobile sidebar */}
                <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />

                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <XMarkIcon className="h-6 w-6 text-white" />
                            </button>
                        </div>

                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="flex-shrink-0 flex items-center px-4">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">JobHunter</h1>
                            </div>
                            <nav className="mt-5 px-2 space-y-1">
                                {navigation.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={item.action}
                                        className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white w-full text-left"
                                    >
                                        <item.icon className="mr-4 flex-shrink-0 h-6 w-6" />
                                        {item.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Desktop sidebar */}
                <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                    <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                            <div className="flex items-center flex-shrink-0 px-4">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">JobHunter</h1>
                            </div>
                            <nav className="mt-5 flex-1 px-2 space-y-1">
                                {navigation.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={item.action}
                                        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white w-full text-left"
                                    >
                                        <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                                        {item.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                        <span className="text-sm font-medium text-white">
                                            {session?.user?.name?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {session?.user?.name || 'User'}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {session?.user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="md:pl-64 flex flex-col flex-1">
                    <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50 dark:bg-gray-900">
                        <button
                            type="button"
                            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </div>

                    <main className="flex-1">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                {/* Header */}
                                <div className="lg:flex lg:items-center lg:justify-between mb-6">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                                            Job Applications
                                        </h2>
                                    </div>
                                    <div className="mt-5 flex lg:mt-0 lg:ml-4">
                                        <button
                                            onClick={() => dispatch(toggleTheme())}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                                        >
                                            {theme === 'light' ? (
                                                <MoonIcon className="h-4 w-4" />
                                            ) : (
                                                <SunIcon className="h-4 w-4" />
                                            )}
                                        </button>

                                        <button
                                            onClick={() => dispatch(openJobModal(null))}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                                        >
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Add Job
                                        </button>

                                        <button
                                            onClick={handleSignOut}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>

                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
} 