import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database/db'
import { userPreferences, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user ID
    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)
    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user preferences
    const preferences = await db.select().from(userPreferences).where(eq(userPreferences.userId, user[0].id)).limit(1)
    
    if (preferences.length === 0) {
      // Create default preferences if none exist
      const defaultPrefs = await db.insert(userPreferences).values({
        userId: user[0].id
      }).returning()
      
      return NextResponse.json(defaultPrefs[0])
    }

    return NextResponse.json(preferences[0])
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Get user ID
    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)
    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update preferences
    const updatedPreferences = await db
      .update(userPreferences)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(userPreferences.userId, user[0].id))
      .returning()

    if (updatedPreferences.length === 0) {
      // Create preferences if they don't exist
      const newPreferences = await db.insert(userPreferences).values({
        userId: user[0].id,
        ...body
      }).returning()
      
      return NextResponse.json(newPreferences[0])
    }

    return NextResponse.json(updatedPreferences[0])
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}