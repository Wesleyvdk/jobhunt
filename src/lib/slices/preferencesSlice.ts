import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PreferencesState {
  // Dashboard Layout
  dashboardLayout: {
    defaultView: 'kanban' | 'table' | 'grid'
    itemsPerPage: number
    showCompletedJobs: boolean
    compactMode: boolean
  }
  
  // Notifications
  notifications: {
    emailNotifications: boolean
    followUpReminders: boolean
    applicationDeadlines: boolean
    weeklyReports: boolean
    pushNotifications: boolean
  }
  
  // Date & Time
  dateTime: {
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
    timeFormat: '12h' | '24h'
    timezone: string
    firstDayOfWeek: 'sunday' | 'monday'
  }
  
  // Export Settings
  exportSettings: {
    defaultFormat: 'csv' | 'excel' | 'pdf'
    includeNotes: boolean
    includePrivateFields: boolean
    dateRange: 'all' | 'last30' | 'last90' | 'custom'
  }
  
  // Theme
  theme: {
    mode: 'light' | 'dark' | 'system'
    accentColor: 'indigo' | 'blue' | 'purple' | 'green' | 'red'
    fontSize: 'small' | 'medium' | 'large'
    reducedMotion: boolean
  }
  
  // Account Settings
  account: {
    twoFactorEnabled: boolean
    sessionTimeout: number // in minutes
    dataRetention: number // in days
    autoBackup: boolean
  }
}

const initialState: PreferencesState = {
  dashboardLayout: {
    defaultView: 'kanban',
    itemsPerPage: 10,
    showCompletedJobs: true,
    compactMode: false
  },
  notifications: {
    emailNotifications: true,
    followUpReminders: true,
    applicationDeadlines: true,
    weeklyReports: false,
    pushNotifications: false
  },
  dateTime: {
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    firstDayOfWeek: 'sunday'
  },
  exportSettings: {
    defaultFormat: 'csv',
    includeNotes: true,
    includePrivateFields: false,
    dateRange: 'all'
  },
  theme: {
    mode: 'system',
    accentColor: 'indigo',
    fontSize: 'medium',
    reducedMotion: false
  },
  account: {
    twoFactorEnabled: false,
    sessionTimeout: 60,
    dataRetention: 365,
    autoBackup: true
  }
}

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    updateDashboardLayout: (state, action: PayloadAction<Partial<PreferencesState['dashboardLayout']>>) => {
      state.dashboardLayout = { ...state.dashboardLayout, ...action.payload }
    },
    updateNotifications: (state, action: PayloadAction<Partial<PreferencesState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload }
    },
    updateDateTime: (state, action: PayloadAction<Partial<PreferencesState['dateTime']>>) => {
      state.dateTime = { ...state.dateTime, ...action.payload }
    },
    updateExportSettings: (state, action: PayloadAction<Partial<PreferencesState['exportSettings']>>) => {
      state.exportSettings = { ...state.exportSettings, ...action.payload }
    },
    updateTheme: (state, action: PayloadAction<Partial<PreferencesState['theme']>>) => {
      state.theme = { ...state.theme, ...action.payload }
    },
    updateAccount: (state, action: PayloadAction<Partial<PreferencesState['account']>>) => {
      state.account = { ...state.account, ...action.payload }
    },
    resetPreferences: (state) => {
      return initialState
    },
    loadPreferences: (state, action: PayloadAction<Partial<PreferencesState>>) => {
      return { ...state, ...action.payload }
    }
  }
})

export const {
  updateDashboardLayout,
  updateNotifications,
  updateDateTime,
  updateExportSettings,
  updateTheme,
  updateAccount,
  resetPreferences,
  loadPreferences
} = preferencesSlice.actions

export default preferencesSlice.reducer