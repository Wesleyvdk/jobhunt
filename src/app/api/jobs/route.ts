import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/database/db';
import { jobs, NewJob } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { UserService } from '@/lib/services/userService';
import { JobStatus } from '@/lib/slices/uiSlice';

const createJobSchema = z.object({
  company: z.string().min(1, 'Company is required').max(100),
  position: z.string().min(1, 'Position is required').max(100),
  applicationDate: z.string().min(1, 'Application date is required'),
  status: z.enum(['Prospect', 'Applied', 'Ghosted', 'Interviewed', 'Rejected', 'Hired'] as const),
  notes: z.string().max(1000).optional(),
  jobLink: z.string().url().optional().or(z.literal('')),
  followUpDate: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await UserService.findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.userId, user.id))
      .orderBy(jobs.createdAt);

    return NextResponse.json({ data: userJobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await UserService.findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = createJobSchema.parse(body);

    const newJobData: NewJob = {
      userId: user.id,
      company: validatedData.company,
      position: validatedData.position,
      applicationDate: validatedData.applicationDate,
      status: validatedData.status,
      notes: validatedData.notes || null,
      jobLink: validatedData.jobLink || null,
      followUpDate: validatedData.followUpDate || null,
    };

    const newJob = await db
      .insert(jobs)
      .values(newJobData)
      .returning();

    return NextResponse.json({ data: newJob[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}