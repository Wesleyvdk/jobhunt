import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/database/db';
import { jobs } from '@/lib/database/schema';
import { eq } from 'drizzle-orm';
import { Parser } from 'json2csv';
import { UserService } from '@/lib/services/userService';

export async function GET() {
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

    const userJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.userId, user.id))
      .orderBy(jobs.createdAt);

    if (!userJobs.length) {
      return NextResponse.json({ error: 'No jobs to export' }, { status: 404 });
    }

    // Transform data for CSV export
    const csvData = userJobs.map(job => ({
      Company: job.company,
      Position: job.position,
      'Application Date': job.applicationDate,
      Status: job.status,
      Notes: job.notes || '',
      'Job Link': job.jobLink || '',
      'Follow-up Date': job.followUpDate || '',
      'Created At': job.createdAt ? new Date(job.createdAt).toISOString() : '',
    }));

    const parser = new Parser({
      fields: ['Company', 'Position', 'Application Date', 'Status', 'Notes', 'Job Link', 'Follow-up Date', 'Created At'],
    });

    const csv = parser.parse(csvData);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="jobs-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting jobs:', error);
    return NextResponse.json(
      { error: 'Failed to export jobs' },
      { status: 500 }
    );
  }
} 