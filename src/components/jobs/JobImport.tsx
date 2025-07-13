'use client'

import React, { useState, useRef } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { addJob } from '@/lib/slices/jobsSlice'
import { useCreateJob } from '@/lib/hooks/useJobs'
import { JobStatus } from '@/lib/slices/uiSlice'
import { XMarkIcon, DocumentArrowUpIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

interface ImportedJob {
    company: string
    position: string
    applicationDate: string
    status: JobStatus
    notes?: string
    jobLink?: string
    followUpDate?: string
}

interface JobImportProps {
    isOpen: boolean
    onClose: () => void
}

interface ImportResult {
    success: ImportedJob[]
    errors: { row: number; error: string; data: any }[]
}

export default function JobImport({ isOpen, onClose }: JobImportProps) {
    const dispatch = useAppDispatch()
    const createJobMutation = useCreateJob()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [importResult, setImportResult] = useState<ImportResult | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload')

    const validateJob = (job: any, rowIndex: number): { isValid: boolean; error?: string; validJob?: ImportedJob } => {
        const errors: string[] = []

        if (!job.company || typeof job.company !== 'string' || job.company.trim() === '') {
            errors.push('Company name is required')
        }

        if (!job.position || typeof job.position !== 'string' || job.position.trim() === '') {
            errors.push('Position is required')
        }

        if (!job.applicationDate) {
            errors.push('Application date is required')
        } else {
            const date = new Date(job.applicationDate)
            if (isNaN(date.getTime())) {
                errors.push('Invalid application date format')
            }
        }

        const validStatuses: JobStatus[] = ['Prospect', 'Applied', 'Ghosted', 'Interviewed', 'Rejected', 'Hired']
        if (job.status && !validStatuses.includes(job.status)) {
            errors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`)
        }

        if (errors.length > 0) {
            return { isValid: false, error: errors.join('; ') }
        }

        return {
            isValid: true,
            validJob: {
                company: job.company.trim(),
                position: job.position.trim(),
                applicationDate: new Date(job.applicationDate).toISOString().split('T')[0],
                status: job.status || 'Applied',
                notes: job.notes?.trim() || '',
                jobLink: job.jobLink?.trim() || '',
                followUpDate: job.followUpDate ? new Date(job.followUpDate).toISOString().split('T')[0] : ''
            }
        }
    }

    const processFile = async (file: File) => {
        setIsProcessing(true)
        const fileExtension = file.name.split('.').pop()?.toLowerCase()

        try {
            let data: any[] = []

            if (fileExtension === 'csv') {
                // Parse CSV
                const text = await file.text()
                const result = Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (header) => {
                        // Normalize header names
                        const normalized = header.toLowerCase().trim()
                        const mapping: { [key: string]: string } = {
                            'company name': 'company',
                            'company_name': 'company',
                            'job title': 'position',
                            'job_title': 'position',
                            'title': 'position',
                            'application date': 'applicationDate',
                            'application_date': 'applicationDate',
                            'date applied': 'applicationDate',
                            'date_applied': 'applicationDate',
                            'applied_date': 'applicationDate',
                            'job status': 'status',
                            'job_status': 'status',
                            'application status': 'status',
                            'application_status': 'status',
                            'job link': 'jobLink',
                            'job_link': 'jobLink',
                            'url': 'jobLink',
                            'link': 'jobLink',
                            'follow up': 'followUpDate',
                            'follow_up': 'followUpDate',
                            'followup': 'followUpDate',
                            'follow up date': 'followUpDate',
                            'follow_up_date': 'followUpDate'
                        }
                        return mapping[normalized] || normalized
                    }
                })
                data = result.data
            } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                // Parse Excel
                const buffer = await file.arrayBuffer()
                const workbook = XLSX.read(buffer, { type: 'array' })
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]
                data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

                // Convert to object format with headers
                if (data.length > 0) {
                    const headers = data[0] as string[]
                    const normalizedHeaders = headers.map(header => {
                        const normalized = header.toLowerCase().trim()
                        const mapping: { [key: string]: string } = {
                            'company name': 'company',
                            'company_name': 'company',
                            'job title': 'position',
                            'job_title': 'position',
                            'title': 'position',
                            'application date': 'applicationDate',
                            'application_date': 'applicationDate',
                            'date applied': 'applicationDate',
                            'date_applied': 'applicationDate',
                            'applied_date': 'applicationDate',
                            'job status': 'status',
                            'job_status': 'status',
                            'application status': 'status',
                            'application_status': 'status',
                            'job link': 'jobLink',
                            'job_link': 'jobLink',
                            'url': 'jobLink',
                            'link': 'jobLink',
                            'follow up': 'followUpDate',
                            'follow_up': 'followUpDate',
                            'followup': 'followUpDate',
                            'follow up date': 'followUpDate',
                            'follow_up_date': 'followUpDate'
                        }
                        return mapping[normalized] || normalized
                    })

                    data = data.slice(1).map((row: any[]) => {
                        const obj: any = {}
                        normalizedHeaders.forEach((header, index) => {
                            obj[header] = row[index]
                        })
                        return obj
                    })
                }
            } else {
                throw new Error('Unsupported file format. Please use CSV or Excel files.')
            }

            // Validate and process data
            const result: ImportResult = {
                success: [],
                errors: []
            }

            data.forEach((job, index) => {
                const validation = validateJob(job, index + 1)
                if (validation.isValid && validation.validJob) {
                    result.success.push(validation.validJob)
                } else {
                    result.errors.push({
                        row: index + 1,
                        error: validation.error || 'Unknown error',
                        data: job
                    })
                }
            })

            setImportResult(result)
            setStep('preview')
        } catch (error) {
            console.error('Error processing file:', error)
            setImportResult({
                success: [],
                errors: [{ row: 0, error: error instanceof Error ? error.message : 'Unknown error', data: {} }]
            })
            setStep('preview')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return
        const file = files[0]
        processFile(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        handleFileSelect(e.dataTransfer.files)
    }

    const handleImport = async () => {
        if (!importResult || importResult.success.length === 0) return

        setIsProcessing(true)
        try {
            for (const job of importResult.success) {
                await createJobMutation.mutateAsync(job)
            }
            setStep('complete')
        } catch (error) {
            console.error('Error importing jobs:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleClose = () => {
        setStep('upload')
        setImportResult(null)
        setIsProcessing(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-md bg-black/40 flex items-center justify-center px-4 py-8">
            <div className="glass-panel max-w-4xl w-full mx-auto relative p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">
                        Import Job Applications
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-200 p-1 rounded-lg hover:bg-white/10 transition-all"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {step === 'upload' && (
                    <div className="space-y-6">
                        <div className="text-sm text-gray-300 space-y-2">
                            <p>Upload a CSV or Excel file with your job applications. The file should include these columns:</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-400">
                                <li><strong>Company</strong> (required) - Company name</li>
                                <li><strong>Position</strong> (required) - Job title/position</li>
                                <li><strong>Application Date</strong> (required) - Date you applied</li>
                                <li><strong>Status</strong> (optional) - Prospect, Applied, Ghosted, Interviewed, Rejected, or Hired</li>
                                <li><strong>Notes</strong> (optional) - Additional notes</li>
                                <li><strong>Job Link</strong> (optional) - URL to job posting</li>
                                <li><strong>Follow Up Date</strong> (optional) - Date for follow-up</li>
                            </ul>
                        </div>

                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragging
                                    ? 'border-indigo-400 bg-indigo-500/10'
                                    : 'border-gray-600 hover:border-gray-500'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <div className="space-y-2">
                                <p className="text-lg font-medium text-white">
                                    Drag and drop your file here
                                </p>
                                <p className="text-gray-400">or</p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="neuro-button px-6 py-2"
                                >
                                    Choose File
                                </button>
                                <p className="text-sm text-gray-500">
                                    Supports CSV, XLS, and XLSX files
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={(e) => handleFileSelect(e.target.files)}
                                className="hidden"
                            />
                        </div>

                        {isProcessing && (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
                                <p className="text-gray-300">Processing file...</p>
                            </div>
                        )}
                    </div>
                )}

                {step === 'preview' && importResult && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass-card">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                    <span className="font-medium text-white">Valid Records</span>
                                </div>
                                <p className="text-2xl font-bold text-green-400">{importResult.success.length}</p>
                            </div>
                            <div className="glass-card">
                                <div className="flex items-center gap-2 mb-2">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                                    <span className="font-medium text-white">Errors</span>
                                </div>
                                <p className="text-2xl font-bold text-red-400">{importResult.errors.length}</p>
                            </div>
                        </div>

                        {importResult.errors.length > 0 && (
                            <div className="glass-card">
                                <h4 className="font-medium text-white mb-3">Errors Found:</h4>
                                <div className="max-h-40 overflow-y-auto space-y-2">
                                    {importResult.errors.map((error, index) => (
                                        <div key={index} className="text-sm p-2 bg-red-500/10 border border-red-500/20 rounded">
                                            <span className="text-red-400">Row {error.row}:</span>
                                            <span className="text-gray-300 ml-2">{error.error}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {importResult.success.length > 0 && (
                            <div className="glass-card">
                                <h4 className="font-medium text-white mb-3">Preview of Valid Records:</h4>
                                <div className="max-h-60 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-600">
                                                <th className="text-left p-2 text-gray-300">Company</th>
                                                <th className="text-left p-2 text-gray-300">Position</th>
                                                <th className="text-left p-2 text-gray-300">Date</th>
                                                <th className="text-left p-2 text-gray-300">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {importResult.success.slice(0, 10).map((job, index) => (
                                                <tr key={index} className="border-b border-gray-700">
                                                    <td className="p-2 text-white">{job.company}</td>
                                                    <td className="p-2 text-white">{job.position}</td>
                                                    <td className="p-2 text-gray-300">{job.applicationDate}</td>
                                                    <td className="p-2">
                                                        <span className={`status-badge status-${job.status.toLowerCase()} text-xs px-2 py-1 rounded-full`}>
                                                            {job.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {importResult.success.length > 10 && (
                                        <p className="text-gray-400 text-center py-2">
                                            ... and {importResult.success.length - 10} more records
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setStep('upload')}
                                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={importResult.success.length === 0 || isProcessing}
                                className="neuro-button px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Importing...' : `Import ${importResult.success.length} Records`}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'complete' && (
                    <div className="text-center space-y-6">
                        <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto" />
                        <div>
                            <h4 className="text-xl font-semibold text-white mb-2">Import Complete!</h4>
                            <p className="text-gray-300">
                                Successfully imported {importResult?.success.length} job applications.
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="neuro-button px-6 py-2"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}