import React from 'react'
import { usePlanner } from '../../context/PlannerContext'
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Target,
  ArrowRight,
} from 'lucide-react'
import ProgressBar from '../common/ProgressBar'

export default function QuickStats({ onStartToday }) {
  const {
    currentLaunchDay,
    daysRemaining,
    stats,
    setActiveTab,
    setSelectedDay,
  } = usePlanner()

  return (
    <div className="space-y-4">
      {/* Hero Progress Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <Flame className="w-3.5 h-3.5 text-blue-400" />
              <span>30-Day Launch Sprint in Progress</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Launch Day {currentLaunchDay} of 30
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {daysRemaining > 0
                ? `${daysRemaining} days remaining until official worldwide go-live. Keep executing your daily milestones.`
                : '30-Day Launch Sprint concluded! Execute your 90-day growth plan.'}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={onStartToday}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>START TODAY'S WORK</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Large Visual Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-700/60 relative z-10">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-xs text-slate-400 font-medium">Overall Company Preparation</span>
              <div className="text-2xl font-bold tracking-tight text-white mt-0.5">
                {stats.overallPercentage}% Complete
              </div>
            </div>
            <div className="text-right text-xs text-slate-300 font-medium">
              <span className="font-semibold text-white">{stats.completed}</span> of{' '}
              <span className="text-slate-400">{stats.total} tasks completed</span>
            </div>
          </div>

          <ProgressBar
            value={stats.overallPercentage}
            size="lg"
            color="gradient"
          />

          {/* 4-Week Milestone indicators */}
          <div className="grid grid-cols-4 gap-2 mt-3 text-[11px] text-slate-400 font-medium">
            <div className={`transition-colors ${stats.weekStats[0]?.percentage === 100 ? 'text-emerald-400 font-semibold' : ''}`}>
              W1: Strategy ({stats.weekStats[0]?.percentage}%)
            </div>
            <div className={`transition-colors ${stats.weekStats[1]?.percentage === 100 ? 'text-emerald-400 font-semibold' : ''}`}>
              W2: Marketing ({stats.weekStats[1]?.percentage}%)
            </div>
            <div className={`transition-colors ${stats.weekStats[2]?.percentage === 100 ? 'text-emerald-400 font-semibold' : ''}`}>
              W3: Infrastructure ({stats.weekStats[2]?.percentage}%)
            </div>
            <div className={`transition-colors ${stats.weekStats[3]?.percentage === 100 ? 'text-emerald-400 font-semibold' : ''}`}>
              W4: Go-Live ({stats.weekStats[3]?.percentage}%)
            </div>
          </div>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Launch Days */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium">Sprint Days</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">30</span>
            <span className="text-xs text-slate-500 font-medium">Day {currentLaunchDay}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Full launch runway</p>
        </div>

        {/* Total Tasks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium">Total Tasks</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">{stats.total}</span>
            <span className="text-xs text-slate-500 font-medium">all 30 days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Populated blueprint</p>
        </div>

        {/* Completed Tasks */}
        <div
          onClick={() => {
            setActiveTab('tasks')
          }}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-600">{stats.completed}</span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              {stats.overallPercentage}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Finished activities</p>
        </div>

        {/* Pending Tasks */}
        <div
          onClick={() => {
            setActiveTab('tasks')
          }}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs hover:border-amber-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-amber-600">{stats.pending}</span>
            <span className="text-xs text-slate-500 font-medium">to execute</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Active backlog</p>
        </div>

        {/* Overdue Tasks */}
        <div
          onClick={() => {
            setActiveTab('tasks')
          }}
          className={`p-4 rounded-xl border shadow-2xs cursor-pointer transition-all ${
            stats.overdue > 0
              ? 'bg-rose-50/60 border-rose-200 hover:border-rose-300'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium">Overdue Tasks</span>
            <AlertTriangle className={`w-4 h-4 ${stats.overdue > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${stats.overdue > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {stats.overdue}
            </span>
            {stats.overdue > 0 && (
              <span className="text-xs text-rose-700 font-semibold bg-rose-100 px-1.5 py-0.5 rounded">
                Action Req.
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Missed past targets</p>
        </div>
      </div>
    </div>
  )
}
