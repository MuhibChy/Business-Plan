import React from 'react'

export function PriorityBadge({ priority = 'Medium', size = 'sm' }) {
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'

  switch (priority) {
    case 'High':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          High
        </span>
      )
    case 'Low':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Low
        </span>
      )
    case 'Medium':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Medium
        </span>
      )
  }
}

export function StatusBadge({ status = 'Not Started', size = 'sm' }) {
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'

  switch (status) {
    case 'Completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Completed
        </span>
      )
    case 'In Progress':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          In Progress
        </span>
      )
    case 'Blocked':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Blocked
        </span>
      )
    case 'Not Started':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Not Started
        </span>
      )
  }
}

export function DayStatusBadge({ completed, total }) {
  if (total === 0) return null
  if (completed === total) {
    return (
      <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
        Done
      </span>
    )
  }
  if (completed > 0) {
    return (
      <span className="inline-flex items-center text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
        {completed}/{total}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
      0/{total}
    </span>
  )
}
