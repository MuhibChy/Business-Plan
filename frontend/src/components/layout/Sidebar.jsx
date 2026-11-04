import React from 'react'
import { usePlanner } from '../../context/PlannerContext'
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  FileText,
  Wrench,
  Boxes,
  Layers,
  Users,
  BarChart3,
  Settings,
  ExternalLink,
  Calendar,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'

export default function Sidebar({ isMobileOpen, setIsMobileOpen, onOpenSettings }) {
  const {
    activeTab,
    setActiveTab,
    currentLaunchDay,
    stats,
    setSelectedDay,
  } = usePlanner()

  const navItems = [
    {
      id: 'dashboard',
      label: 'Launch Dashboard',
      icon: LayoutDashboard,
      badge: `${stats.todayCompleted}/${stats.todayTotal}`,
      badgeColor: 'bg-blue-900/60 text-blue-200 border-blue-700/50',
    },
    {
      id: 'tasks',
      label: '30-Day Daily Plan',
      icon: CheckSquare,
      badge: stats.overdue > 0 ? `${stats.overdue} overdue` : `${stats.pending} left`,
      badgeColor: stats.overdue > 0 ? 'bg-rose-900/60 text-rose-200 border-rose-700/50' : 'bg-slate-800 text-slate-300',
    },
    {
      id: 'branding',
      label: 'Branding & Marketing',
      icon: Sparkles,
      sub: 'Module A',
    },
    {
      id: 'documents',
      label: 'Document Manager',
      icon: FileText,
      sub: 'Module B',
    },
    {
      id: 'equipment',
      label: 'Equipment Inventory',
      icon: Wrench,
      sub: 'Module C',
    },
    {
      id: 'software',
      label: 'Software & Tools',
      icon: Boxes,
      sub: 'Module D',
    },
    {
      id: 'services',
      label: 'Services & Pricing',
      icon: Layers,
      sub: 'Module E',
    },
    {
      id: 'leads',
      label: 'Client Leads CRM',
      icon: Users,
      sub: 'Module F',
    },
    {
      id: 'analytics',
      label: 'Readiness Analytics',
      icon: BarChart3,
    },
  ]

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'tasks') {
      setSelectedDay(currentLaunchDay)
    }
    if (setIsMobileOpen) {
      setIsMobileOpen(false)
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                IT SUPPORT 30D
              </h1>
              <span className="text-[10px] font-medium text-blue-400 block tracking-wide uppercase">
                Launch Management
              </span>
            </div>
          </div>
        </div>

        {/* Day Status Pill */}
        <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Current Day
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-xs border border-blue-500/30">
              Day {currentLaunchDay} of 30
            </span>
          </div>

          <div className="mt-2.5">
            <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
              <span>Overall Progress</span>
              <span className="font-semibold text-white">{stats.overallPercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${stats.overallPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <div className="text-left truncate">
                    <span className="block truncate">{item.label}</span>
                    {item.sub && (
                      <span className={`text-[9px] block ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                        {item.sub}
                      </span>
                    )}
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border shrink-0 ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-1.5">
          {/* Link to company site */}
          <a
            href="http://localhost/techsupport-platform/public"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
            title="Open existing company customer website"
          >
            <div className="flex items-center gap-2 truncate">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Company Website</span>
            </div>
            <span className="text-[10px] text-slate-500">Live</span>
          </a>

          {/* Settings & Backups */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Settings & Backup</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </aside>
    </>
  )
}
