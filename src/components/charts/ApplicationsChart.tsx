'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Job } from '@/lib/slices/jobsSlice'
import { useMemo } from 'react'
import { format, subDays, eachDayOfInterval } from 'date-fns'

interface ApplicationsChartProps {
  jobs: Job[]
}

export default function ApplicationsChart({ jobs }: ApplicationsChartProps) {
  const chartData = useMemo(() => {
    const endDate = new Date()
    const startDate = subDays(endDate, 30) // Last 30 days
    
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate })
    
    return dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const applicationsOnDate = jobs.filter(job => 
        format(new Date(job.applicationDate), 'yyyy-MM-dd') === dateStr
      ).length
      
      return {
        date: format(date, 'MMM dd'),
        applications: applicationsOnDate,
        cumulative: jobs.filter(job => 
          new Date(job.applicationDate) <= date
        ).length
      }
    })
  }, [jobs])

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.7)"
            fontSize={12}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.7)"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="applications" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            name="Daily Applications"
          />
          <Line 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#06b6d4" 
            strokeWidth={2}
            dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
            name="Total Applications"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}