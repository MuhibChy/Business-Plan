import React from 'react'
import { usePlanner } from '../../context/PlannerContext'
import {
  Menu,
  Search,
  X,
  Play,
  Download,
  Printer,
  Calendar,
  Settings,
  Sparkles,
} from 'lucide-react'
import { exportTasksToCSV, printChecklist } from '../../utils/exportUtils'
import { formatDate } from '../../utils/dateUtils'

export default function Navbar({ onToggleMobile, onOpenSettings }) {
  const {
    tasks,
    currentLaunchDay,
    launchStartDate,
    setActiveTab,
    setSelectedDay,
    searchQuery,
    setSearchQuery,
    stats,
  } = usePlanner()

  const handleStartToday = () => {
    setActiveTab('tasks')
    setSelectedDay(currentLaunchDay)
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleExportCSV = () => {
    exportTasksToCSV(tasks)
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-2xs">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleMobile}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 300+ launch tasks, SOPs, tools..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Launch Start Date pill */}
        <button
          onClick={onOpenSettings}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          title="Change launch start date"
        >
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Start: {formatDate(launchStartDate)}</span>
        </button>

        {/* CSV Export */}
        <button
          onClick={handleExportCSV}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
          title="Export complete 30-day plan to CSV spreadsheet"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>

        {/* Print checklist */}
        <button
          onClick={() => printChecklist()}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
          title="Print daily checklist"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Print</span>
        </button>

        {/* Primary CTA: START TODAY'S WORK */}
        <button
          type="button"
          onClick={handleStartToday}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>START TODAY'S WORK</span>
          <span className="hidden sm:inline-block ml-1 px-1.5 py-0.2 rounded-full bg-blue-500 text-[10px] text-white">
            Day {currentLaunchDay}
          </span>
        </button>

        {/* Settings button on mobile */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 sm:hidden"
          title="Settings and Backups"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
