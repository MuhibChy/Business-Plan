import React from 'react'

export default function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  color = 'blue',
  showLabel = false,
  labelPrefix = '',
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

  const heightClasses = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  }

  const colorClasses = {
    blue: 'bg-blue-600',
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    rose: 'bg-rose-600',
    navy: 'bg-slate-900',
    gradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500',
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          <span>{labelPrefix}</span>
          <span className="font-semibold text-slate-900">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[size] || 'h-2.5'}`}>
        <div
          className={`${colorClasses[color] || 'bg-blue-600'} ${heightClasses[size] || 'h-2.5'} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
