'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'

interface OnboardingStep {
    id: string
    title: string
    description: string
    component: React.ReactNode
}

interface OnboardingFlowProps {
    onComplete: () => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [preferences, setPreferences] = useState({
        name: '',
        jobTitle: '',
        experience: '',
        goals: [] as string[],
        theme: 'indigo',
        notifications: true
    })
    const { data: session } = useSession()
    const router = useRouter()

    const steps: OnboardingStep[] = [
        {
            id: 'welcome',
            title: 'Welcome to JobHunter!',
            description: 'Let\'s get you set up to track your job applications effectively.',
            component: (
                <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Hi {session?.user?.name || 'there'}!</h3>
                        <p className="text-gray-400">
                            We'll help you organize your job search and never miss an opportunity again.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'profile',
            title: 'Tell us about yourself',
            description: 'This helps us personalize your experience.',
            component: (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            What's your current job title or desired role?
                        </label>
                        <input
                            type="text"
                            value={preferences.jobTitle}
                            onChange={(e) => setPreferences(prev => ({ ...prev, jobTitle: e.target.value }))}
                            placeholder="e.g., Software Engineer, Product Manager"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Years of experience
                        </label>
                        <select
                            value={preferences.experience}
                            onChange={(e) => setPreferences(prev => ({ ...prev, experience: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        >
                            <option value="">Select experience level</option>
                            <option value="entry">Entry Level (0-2 years)</option>
                            <option value="mid">Mid Level (3-5 years)</option>
                            <option value="senior">Senior Level (6-10 years)</option>
                            <option value="lead">Lead/Principal (10+ years)</option>
                        </select>
                    </div>
                </div>
            )
        },
        {
            id: 'goals',
            title: 'What are your job search goals?',
            description: 'Select all that apply to customize your dashboard.',
            component: (
                <div className="space-y-4">
                    {[
                        { id: 'remote', label: 'Find remote opportunities' },
                        { id: 'salary', label: 'Increase salary' },
                        { id: 'growth', label: 'Career growth' },
                        { id: 'culture', label: 'Better work culture' },
                        { id: 'skills', label: 'Learn new skills' },
                        { id: 'balance', label: 'Work-life balance' }
                    ].map((goal) => (
                        <label key={goal.id} className={`relative flex items-center space-x-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${preferences.goals.includes(goal.id)
                            ? 'border-purple-400/60 bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/25'
                            : 'border-white/10 bg-white/5 hover:border-purple-300/40 hover:bg-white/10 hover:shadow-md'
                            }`}>
                            <input
                                type="checkbox"
                                checked={preferences.goals.includes(goal.id)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setPreferences(prev => ({ ...prev, goals: [...prev.goals, goal.id] }))
                                    } else {
                                        setPreferences(prev => ({ ...prev, goals: prev.goals.filter(g => g !== goal.id) }))
                                    }
                                }}
                                className="sr-only"
                            />
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${preferences.goals.includes(goal.id)
                                ? 'border-purple-400 bg-purple-500 shadow-lg shadow-purple-500/50'
                                : 'border-white/30 bg-transparent group-hover:border-purple-300'
                                }`}>
                                {preferences.goals.includes(goal.id) && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <span className={`font-medium flex-1 transition-colors duration-300 ${preferences.goals.includes(goal.id)
                                ? 'text-white'
                                : 'text-gray-300 group-hover:text-white'
                                }`}>
                                {goal.label}
                            </span>
                            {preferences.goals.includes(goal.id) && (
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none" />
                            )}
                        </label>
                    ))}
                </div>
            )
        },
        {
            id: 'theme',
            title: 'Choose your theme',
            description: 'Pick a color scheme that suits your style.',
            component: (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { id: 'indigo', name: 'Indigo', colors: 'from-indigo-500 to-purple-500' },
                            { id: 'blue', name: 'Blue', colors: 'from-blue-500 to-cyan-500' },
                            { id: 'emerald', name: 'Emerald', colors: 'from-emerald-500 to-teal-500' },
                            { id: 'rose', name: 'Rose', colors: 'from-rose-500 to-pink-500' }
                        ].map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => setPreferences(prev => ({ ...prev, theme: theme.id }))}
                                className={`p-4 rounded-lg border-2 transition-all ${preferences.theme === theme.id
                                    ? 'border-white/40 bg-white/10'
                                    : 'border-white/10 bg-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className={`w-full h-8 bg-gradient-to-r ${theme.colors} rounded mb-2`}></div>
                                <span className="text-white font-medium">{theme.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'notifications',
            title: 'Stay organized with reminders',
            description: 'Configure notifications and tracking preferences.',
            component: (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <span className="text-white font-medium">Follow-up reminders</span>
                                <p className="text-gray-400 text-sm">Get reminded when it's time to follow up on applications</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={preferences.notifications}
                                onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
                                className="w-5 h-5 text-purple-500 bg-white/5 border-white/20 rounded focus:ring-purple-500"
                            />
                        </label>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Coming Soon: Browser Extension
                        </h4>
                        <p className="text-gray-300 text-sm mb-3">
                            We're building a browser extension that will automatically detect and track your job applications across popular job sites like LinkedIn, Indeed, and Glassdoor.
                        </p>
                        <div className="flex items-center text-xs text-blue-300">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                            Auto-capture applications • Smart form detection • Seamless sync
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">💡 For Now</h4>
                        <p className="text-gray-400 text-sm">
                            Manually add your applications to keep track of your job search progress. Set follow-up dates to get timely reminders.
                        </p>
                    </div>
                </div>
            )
        }
    ]

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleComplete = async () => {
        try {
            await fetch('/api/onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...preferences,
                    completed: true
                })
            })

            onComplete()
        } catch (error) {
            console.error('Failed to save onboarding preferences:', error)
            onComplete()
        }
    }

    const currentStepData = steps[currentStep]
    const progress = ((currentStep + 1) / steps.length) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Step {currentStep + 1} of {steps.length}</span>
                        <span>{Math.round(progress)}% complete</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">{currentStepData.title}</h2>
                        <p className="text-gray-400">{currentStepData.description}</p>
                    </div>

                    <div className="mb-8">
                        {currentStepData.component}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className="flex items-center space-x-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                            <span>Previous</span>
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                        >
                            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}