'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'

interface ThemeContextType {
    theme: string
    setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

const themeColors = {
    indigo: {
        primary: 'rgb(99, 102, 241)',
        primaryHover: 'rgb(79, 70, 229)',
        gradient: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(147, 51, 234) 100%)',
        gradientHover: 'linear-gradient(135deg, rgb(79, 70, 229) 0%, rgb(126, 34, 206) 100%)'
    },
    blue: {
        primary: 'rgb(59, 130, 246)',
        primaryHover: 'rgb(37, 99, 235)',
        gradient: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(14, 165, 233) 100%)',
        gradientHover: 'linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(2, 132, 199) 100%)'
    },
    emerald: {
        primary: 'rgb(16, 185, 129)',
        primaryHover: 'rgb(5, 150, 105)',
        gradient: 'linear-gradient(135deg, rgb(16, 185, 129) 0%, rgb(6, 182, 212) 100%)',
        gradientHover: 'linear-gradient(135deg, rgb(5, 150, 105) 0%, rgb(8, 145, 178) 100%)'
    },
    rose: {
        primary: 'rgb(244, 63, 94)',
        primaryHover: 'rgb(225, 29, 72)',
        gradient: 'linear-gradient(135deg, rgb(244, 63, 94) 0%, rgb(236, 72, 153) 100%)',
        gradientHover: 'linear-gradient(135deg, rgb(225, 29, 72) 0%, rgb(219, 39, 119) 100%)'
    }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const preferences = useSelector((state: RootState) => state.preferences)
    const [theme, setThemeState] = useState('indigo')

    useEffect(() => {
        const selectedTheme = preferences.theme?.accentColor || 'indigo'
        setThemeState(selectedTheme)
        applyTheme(selectedTheme)
    }, [preferences.theme?.accentColor])

    const applyTheme = (themeName: string) => {
        const colors = themeColors[themeName as keyof typeof themeColors] || themeColors.indigo

        // Apply CSS custom properties
        document.documentElement.style.setProperty('--color-primary', colors.primary)
        document.documentElement.style.setProperty('--color-primary-hover', colors.primaryHover)
        document.documentElement.style.setProperty('--gradient-primary', colors.gradient)
        document.documentElement.style.setProperty('--gradient-primary-hover', colors.gradientHover)

        // Update data attribute for CSS selectors
        document.documentElement.setAttribute('data-theme', themeName)
    }

    const setTheme = (newTheme: string) => {
        setThemeState(newTheme)
        applyTheme(newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}