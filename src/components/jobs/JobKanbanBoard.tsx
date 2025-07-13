import React from 'react'
import { DndContext, closestCenter, DragEndEvent, useDroppable } from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { Job } from '@/lib/slices/jobsSlice'
import { format } from 'date-fns'
import { CalendarIcon } from '@heroicons/react/24/outline'

const STATUSES = [
    { key: 'Prospect', label: 'Prospect', color: 'bg-blue-500' },
    { key: 'Applied', label: 'Applied', color: 'bg-yellow-500' },
    { key: 'Ghosted', label: 'Ghosted', color: 'bg-gray-500' },
    { key: 'Interviewed', label: 'Interview', color: 'bg-purple-500' },
    { key: 'Rejected', label: 'Rejected', color: 'bg-red-500' },
    { key: 'Hired', label: 'Hired', color: 'bg-green-500' },
]

interface JobKanbanBoardProps {
    jobs: Job[]
    onStatusChange: (jobId: number, newStatus: string) => void
}

interface JobCardProps {
    job: Job
}

function JobCard({ job }: JobCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: job.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="glass-card p-4 cursor-move hover:shadow-lg transition-all duration-200 border border-white/10"
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white text-sm truncate">{job.company}</h3>
                <span className={`status-badge status-${job.status.toLowerCase()} text-xs px-2 py-1 rounded-full`}>
                    {job.status}
                </span>
            </div>
            <p className="text-white/80 text-sm mb-3 truncate">{job.position}</p>
            <div className="flex items-center gap-2 text-white/60 text-xs">
                <CalendarIcon className="w-3 h-3" />
                <span>{format(new Date(job.applicationDate), 'MMM dd')}</span>
            </div>
            {/* Removed salary section since Job interface doesn't have salary property */}
        </div>
    )
}

interface DroppableColumnProps {
    status: typeof STATUSES[0]
    jobs: Job[]
}

function DroppableColumn({ status, jobs }: DroppableColumnProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: status.key,
    })

    return (
        <div
            ref={setNodeRef}
            className={`glass-panel min-w-[300px] w-80 p-4 flex flex-col h-fit transition-all duration-200 ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-500/10' : ''
                }`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                    <h2 className="font-semibold text-white">{status.label}</h2>
                </div>
                <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full">
                    {jobs.length}
                </span>
            </div>
            <SortableContext items={jobs.map(job => job.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3 min-h-[200px]">
                    {jobs.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))}
                    {jobs.length === 0 && (
                        <div className="text-white/40 text-sm text-center py-8">
                            No jobs in this status
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    )
}

export default function JobKanbanBoard({ jobs, onStatusChange }: JobKanbanBoardProps) {
    const [columns, setColumns] = useState(() => {
        const grouped: Record<string, Job[]> = {}
        STATUSES.forEach(({ key }) => {
            grouped[key] = jobs.filter((job) => job.status === key)
        })
        return grouped
    })

    // Update columns when jobs prop changes
    React.useEffect(() => {
        const grouped: Record<string, Job[]> = {}
        STATUSES.forEach(({ key }) => {
            grouped[key] = jobs.filter((job) => job.status === key)
        })
        setColumns(grouped)
    }, [jobs])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = Number(active.id)
        const overId = over.id as string

        // Find source column
        let sourceCol = null
        for (const status of STATUSES) {
            if (columns[status.key].find((job) => job.id === activeId)) {
                sourceCol = status.key
                break
            }
        }

        // The overId should be the status key when dropping on a column
        const destCol = STATUSES.find(s => s.key === overId)?.key

        if (sourceCol && destCol && sourceCol !== destCol) {
            const job = columns[sourceCol].find((j) => j.id === activeId)
            if (job) {
                // Optimistically update local state immediately
                setColumns(prev => {
                    const newColumns = { ...prev }

                    // Remove job from source column
                    newColumns[sourceCol] = newColumns[sourceCol].filter(j => j.id !== activeId)

                    // Add job to destination column with updated status
                    const updatedJob = { ...job, status: destCol as any }
                    newColumns[destCol] = [...newColumns[destCol], updatedJob]

                    return newColumns
                })

                // Then update the backend
                onStatusChange(job.id, destCol)
            }
        }
    }

    return (
        <div className="kanban-container">
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-6 overflow-x-auto pb-6">
                    {STATUSES.map((status) => (
                        <DroppableColumn
                            key={status.key}
                            status={status}
                            jobs={columns[status.key] || []}
                        />
                    ))}
                </div>
            </DndContext>
        </div>
    )
}