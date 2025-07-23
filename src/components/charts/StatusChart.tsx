'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Job } from '@/lib/slices/jobsSlice'
import { useMemo } from 'react'

interface StatusChartProps {
  jobs: Job[]
}

const STATUS_COLORS = {
  'Open': '#3b82f6',
  'Applied': '#f59e0b',
  'Interviewed': '#8b5cf6',
  'Rejected': '#ef4444',
  'Hired': '#10b981',
  'Invited': '#06b6d4'
}

export default function StatusChart({ jobs }: StatusChartProps) {
  const chartData = useMemo(() => {
    const statusCounts: Record<string, number> = {}

    jobs.forEach(job => {
      statusCounts[job.status] = (statusCounts[job.status] || 0) + 1
    })

    return Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: status,
        value: count,
        color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#6b7280'
      }))
  }, [jobs])

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Legend
            wrapperStyle={{ color: 'rgba(255,255,255,0.8)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}