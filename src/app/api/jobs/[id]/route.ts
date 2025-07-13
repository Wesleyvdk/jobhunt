import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/database/db';
import { jobs } from '@/lib/database/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { UserService } from '@/lib/services/userService';

const updateJobSchema = z.object({
  company: z.string().min(1, 'Company is required').max(100).optional(),
  position: z.string().min(1, 'Position is required').max(100).optional(),
  applicationDate: z.string().min(1, 'Application date is required').optional(),
  status: z.enum(['Prospect', 'Applied', 'Ghosted', 'Interviewed', 'Rejected', 'Hired']).optional(),
  notes: z.string().max(1000).optional(),
  jobLink: z.string().url().optional().or(z.literal('')),
  followUpDate: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by email to get their ID
    const user = await UserService.findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Await params before accessing properties
    const { id } = await params;
    const jobId = parseInt(id);
    if (isNaN(jobId)) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateJobSchema.parse(body);

    // Check if job exists and belongs to user
    const existingJob = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.userId, user.id)))
      .limit(1);

    if (!existingJob.length) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const updateData: any = {
      ...validatedData,
      updatedAt: new Date(),
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedJob = await db
      .update(jobs)
      .set(updateData)
      .where(and(eq(jobs.id, jobId), eq(jobs.userId, user.id)))
      .returning();

    return NextResponse.json({ data: updatedJob[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user by email to get their ID
    const user = await UserService.findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Await params before accessing properties
    const { id } = await params;
    const jobId = parseInt(id);
    if (isNaN(jobId)) {
      return NextResponse.json({ error: 'Invalid job ID' }, { status: 400 });
    }

    // Check if job exists and belongs to user
    const existingJob = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.userId, user.id)))
      .limit(1);

    if (!existingJob.length) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    await db
      .delete(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.userId, user.id)));

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}