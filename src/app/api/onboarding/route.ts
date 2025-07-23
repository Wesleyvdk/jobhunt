import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database/db'
import { userPreferences, users } from '@/lib/database/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { jobTitle, experience, goals, theme, notifications, completed } = body

    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)
    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingPrefs = await db.select().from(userPreferences).where(eq(userPreferences.userId, user[0].id)).limit(1)
    
    const preferencesData = {
      userId: user[0].id,
      accentColor: theme || 'indigo',
      emailNotifications: notifications ?? true,
      onboardingCompleted: completed ?? true,
      defaultView: existingPrefs[0]?.defaultView || 'kanban',
      itemsPerPage: existingPrefs[0]?.itemsPerPage || 10,
      showCompletedJobs: existingPrefs[0]?.showCompletedJobs ?? true,
      compactMode: existingPrefs[0]?.compactMode ?? false,
      followUpReminders: existingPrefs[0]?.followUpReminders ?? true,
      applicationDeadlines: existingPrefs[0]?.applicationDeadlines ?? true,
      weeklyReports: existingPrefs[0]?.weeklyReports ?? false,
      pushNotifications: existingPrefs[0]?.pushNotifications ?? false,
      dateFormat: existingPrefs[0]?.dateFormat || 'MM/DD/YYYY',
      timeFormat: existingPrefs[0]?.timeFormat || '12h',
      timezone: existingPrefs[0]?.timezone || 'UTC',
      firstDayOfWeek: existingPrefs[0]?.firstDayOfWeek || 'sunday',
      defaultExportFormat: existingPrefs[0]?.defaultExportFormat || 'csv',
      includeNotes: existingPrefs[0]?.includeNotes ?? true,
      includePrivateFields: existingPrefs[0]?.includePrivateFields ?? false,
      exportDateRange: existingPrefs[0]?.exportDateRange || 'all',
      themeMode: existingPrefs[0]?.themeMode || 'system',
      fontSize: existingPrefs[0]?.fontSize || 'medium',
      reducedMotion: existingPrefs[0]?.reducedMotion ?? false,
      twoFactorEnabled: existingPrefs[0]?.twoFactorEnabled ?? false,
      sessionTimeout: existingPrefs[0]?.sessionTimeout || 60,
      dataRetention: existingPrefs[0]?.dataRetention || 365,
      autoBackup: existingPrefs[0]?.autoBackup ?? true,
      onboardingStep: 0,
      welcomeMessageSeen: true
    }

    if (existingPrefs.length > 0) {
      await db.update(userPreferences)
        .set(preferencesData)
        .where(eq(userPreferences.userId, user[0].id))
    } else {
      await db.insert(userPreferences).values(preferencesData)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)
    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const preferences = await db.select().from(userPreferences).where(eq(userPreferences.userId, user[0].id)).limit(1)
    
    return NextResponse.json({ 
      completed: preferences.length > 0 ? preferences[0].onboardingCompleted : false 
    })
  } catch (error) {
    console.error('Onboarding check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}