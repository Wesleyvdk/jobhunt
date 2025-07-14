'use client'

import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'
import { ThemeProvider } from './providers/ThemeProvider'
import { PreferencesLoader } from './providers/PreferencesLoader'
import { useState } from 'react'

interface ProvidersProps {
    children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                refetchOnWindowFocus: false,
            },
        },
    }))

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <PreferencesLoader>
                        <ThemeProvider>
                            {children}
                        </ThemeProvider>
                    </PreferencesLoader>
                </Provider>
            </QueryClientProvider>
        </SessionProvider>
    )
}