import React, { useState } from 'react'
import { PlannerProvider, usePlanner } from './context/PlannerContext'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import QuickStats from './components/dashboard/QuickStats'
import { PriorityBadge, StatusBadge, DayStatusBadge } from './components/common/Badge'
import ProgressBar from './components/common/ProgressBar'
import {
  CheckSquare,
  Clock,
  Sparkles,
  FileText,
  Wrench,
  Boxes,
  Layers,
  Users,
  BarChart3,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react'
import { exportCompleteJSONBackup, exportTasksToCSV, printChecklist } from './utils/exportUtils'
import { formatDate } from './utils/dateUtils'

function MainContent() {
  const {
    activeTab,
    setActiveTab,
    selectedDay,
    setSelectedDay,
    currentLaunchDay,
    tasks,
    toggleTaskCompletion,
    updateTaskStatus,
    updateTaskNotes,
    updateTaskPriority,
    stats,
    brandingAssets,
    setBrandingAssets,
    documents,
    setDocuments,
    equipment,
    setEquipment,
    software,
    setSoftware,
    services,
    leads,
    setLeads,
    DAY_METADATA,
    WEEK_INFO,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    activityLog,
    getFullExportState,
    resetAllProgress
  } = usePlanner()

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [selectedTaskForNotes, setSelectedTaskForNotes] = useState(null)
  const [taskNotesInput, setTaskNotesInput] = useState('')
  const [newLeadModal, setNewLeadModal] = useState(false)
  const [newLeadData, setNewLeadData] = useState({ company: '', contact: '', service: '', value: 10000, stage: 'New Lead' })

  // Filter tasks for the tasks view
  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'tasks' && selectedDay && t.day !== selectedDay) return false
    if (statusFilter !== 'All' && t.status !== statusFilter) return false
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q))
      )
    }
    return true
  })

  // Selected Day Metadata
  const currentDayMeta = DAY_METADATA.find((d) => d.day === selectedDay) || DAY_METADATA[0]

  const openNotesModal = (task) => {
    setSelectedTaskForNotes(task)
    setTaskNotesInput(task.notes || '')
  }

  const saveNotesModal = () => {
    if (selectedTaskForNotes) {
      updateTaskNotes(selectedTaskForNotes.id, taskNotesInput)
      setSelectedTaskForNotes(null)
    }
  }

  const handleAddLead = (e) => {
    e.preventDefault()
    if (!newLeadData.company.trim()) return
    const newL = {
      id: 'lead-' + Date.now(),
      company: newLeadData.company,
      contact: newLeadData.contact,
      service: newLeadData.service || 'Managed IT Support',
      estimatedValue: Number(newLeadData.value) || 5000,
      stage: newLeadData.stage,
      probability: 50,
      expectedClose: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
    setLeads([newL, ...leads])
    setNewLeadModal(false)
    setNewLeadData({ company: '', contact: '', service: '', value: 10000, stage: 'New Lead' })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Navbar onToggleMobile={() => setIsMobileOpen(!isMobileOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <QuickStats onStartToday={() => { setActiveTab('tasks'); setSelectedDay(currentLaunchDay) }} />

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-medium text-slate-500">Overall Completed</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {stats.completed} <span className="text-xs text-slate-400 font-normal">/ {stats.total}</span>
                  </div>
                  <ProgressBar value={stats.completed} max={stats.total} size="sm" color="emerald" className="mt-2" />
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-medium text-slate-500">Today's Tasks</span>
                  <div className="text-2xl font-bold text-blue-600 mt-1">
                    {stats.todayCompleted} <span className="text-xs text-slate-400 font-normal">/ {stats.todayTotal}</span>
                  </div>
                  <ProgressBar value={stats.todayCompleted} max={stats.todayTotal || 1} size="sm" color="blue" className="mt-2" />
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-medium text-slate-500">In Progress</span>
                  <div className="text-2xl font-bold text-amber-600 mt-1">{stats.inProgress}</div>
                  <p className="text-[11px] text-slate-400 mt-2">Active focus items</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-medium text-slate-500">Overdue / Delayed</span>
                  <div className={`text-2xl font-bold mt-1 ${stats.overdue > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                    {stats.overdue}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Requires catch-up</p>
                </div>
              </div>

              {/* Today's Tasks Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-blue-600" /> Today's Action Checklist (Day {currentLaunchDay})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">High-priority operational gates for today</p>
                  </div>
                  <button
                    onClick={() => { setActiveTab('tasks'); setSelectedDay(currentLaunchDay) }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {tasks.filter(t => t.day === currentLaunchDay).slice(0, 6).map((task) => (
                    <div key={task.id} className="py-3 flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-0 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {task.title}
                          </span>
                          <PriorityBadge priority={task.priority} size="xs" />
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{task.description}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> {task.estimatedTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: 30-DAY TASKS VIEW */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Day Selector Ribbon */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Jump to Launch Day</span>
                  <span className="text-xs font-medium text-blue-600">Day {selectedDay} of 30</span>
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5 overflow-x-auto pb-1">
                  {DAY_METADATA.map((d) => {
                    const isSelected = d.day === selectedDay
                    const isToday = d.day === currentLaunchDay
                    const dayTasks = tasks.filter((t) => t.day === d.day)
                    const dayDone = dayTasks.filter((t) => t.completed).length
                    const allDone = dayTasks.length > 0 && dayDone === dayTasks.length

                    return (
                      <button
                        key={d.day}
                        onClick={() => setSelectedDay(d.day)}
                        className={`p-2 rounded-xl text-center flex flex-col items-center justify-center transition border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : allDone
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : isToday
                            ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[10px] font-bold">D{d.day}</span>
                        <span className="text-[9px] opacity-75">{dayDone}/{dayTasks.length}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Day Header Banner */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                      Day {selectedDay} • Week {currentDayMeta.week}
                    </span>
                    <span className="text-xs text-slate-400">{WEEK_INFO.find((w) => w.week === currentDayMeta.week)?.title}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{currentDayMeta.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">{currentDayMeta.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-700"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 text-slate-700"
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Task Items List */}
              <div className="space-y-3">
                {filteredTasks.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
                    No tasks match the selected filters for Day {selectedDay}.
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs ${
                        task.completed ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          className="mt-1 w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-0 cursor-pointer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {task.title}
                            </h4>
                            <PriorityBadge priority={task.priority} size="xs" />
                            <StatusBadge status={task.status} size="xs" />
                            {task.category && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                {task.category}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{task.description}</p>
                          {task.notes && (
                            <p className="text-[11px] text-blue-600 mt-1 italic bg-blue-50/60 p-1.5 rounded-lg border border-blue-100">
                              Note: {task.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {task.estimatedTime}
                        </span>
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Blocked">Blocked</option>
                        </select>
                        <button
                          onClick={() => openNotesModal(task)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                          title="Add/Edit Notes"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: BRANDING & MARKETING */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" /> Module A: Branding & Marketing Collateral
                </h2>
                <p className="text-xs text-slate-500 mt-1">Track company identity assets, corporate stationary, and marketing materials.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brandingAssets.map((asset) => (
                  <div key={asset.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{asset.category}</span>
                        <StatusBadge status={asset.status} size="xs" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{asset.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{asset.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Specs: {asset.specs || 'Vector / Print'}</span>
                      <button
                        onClick={() => {
                          const newStatus = asset.status === 'Completed' ? 'In Progress' : 'Completed'
                          setBrandingAssets(brandingAssets.map(a => a.id === asset.id ? { ...a, status: newStatus } : a))
                        }}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                          asset.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {asset.status === 'Completed' ? 'Done' : 'Mark Done'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" /> Module B: Operational Document Manager
                </h2>
                <p className="text-xs text-slate-500 mt-1">SLA contracts, customer proposals, onboarding packets, and policy manuals.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{doc.category}</span>
                        <StatusBadge status={doc.status} size="xs" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{doc.purpose}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Owner: {doc.owner || 'Operations'}</span>
                      <button
                        onClick={() => {
                          const newStatus = doc.status === 'Ready' ? 'Draft' : 'Ready'
                          setDocuments(documents.map(d => d.id === doc.id ? { ...d, status: newStatus } : d))
                        }}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                          doc.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {doc.status === 'Ready' ? 'Approved' : 'Approve'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EQUIPMENT INVENTORY */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-blue-600" /> Module C: Hardware & Equipment Inventory
                </h2>
                <p className="text-xs text-slate-500 mt-1">Essential computers, networking tools, diagnostic kits, and workstation setup.</p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {equipment.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-slate-800">{item.name}</td>
                        <td className="py-3 px-4 text-slate-500">{item.category}</td>
                        <td className="py-3 px-4"><PriorityBadge priority={item.priority} size="xs" /></td>
                        <td className="py-3 px-4"><StatusBadge status={item.status} size="xs" /></td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              const newStatus = item.status === 'Acquired' ? 'Pending' : 'Acquired'
                              setEquipment(equipment.map(e => e.id === item.id ? { ...e, status: newStatus } : e))
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              item.status === 'Acquired' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {item.status === 'Acquired' ? 'Acquired' : 'Mark Acquired'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SOFTWARE & TOOLS */}
          {activeTab === 'software' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-purple-600" /> Module D: IT Software & Digital Tools Stack
                </h2>
                <p className="text-xs text-slate-500 mt-1">Remote support agents, ticketing systems, monitoring tools, and cloud platforms.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {software.map((tool) => (
                  <div key={tool.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tool.category}</span>
                        <StatusBadge status={tool.status} size="xs" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{tool.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tool.purpose}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-purple-700 font-semibold">{tool.license || 'Subscription'}</span>
                      <button
                        onClick={() => {
                          const newStatus = tool.status === 'Configured' ? 'Trial' : 'Configured'
                          setSoftware(software.map(s => s.id === tool.id ? { ...s, status: newStatus } : s))
                        }}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                          tool.status === 'Configured' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tool.status === 'Configured' ? 'Configured' : 'Configure'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SERVICES & PRICING */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" /> Module E: 19 Core IT Services & Pricing Matrix
                </h2>
                <p className="text-xs text-slate-500 mt-1">Standardized offerings, hourly rates, monthly MSP retainers, and SLA terms.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((svc) => (
                  <div key={svc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{svc.category}</span>
                        <span className="text-xs font-bold text-emerald-600">{svc.pricingModel}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{svc.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{svc.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Standard Rate:</span>
                        <span className="font-bold text-slate-900">{svc.standardRate}</span>
                      </div>
                      {svc.sla && (
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                          <span>Target SLA:</span>
                          <span>{svc.sla}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LEADS CRM */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" /> Module F: Client Leads & Sales CRM
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Pipeline of qualified prospective companies and contract opportunities.</p>
                </div>
                <button
                  onClick={() => setNewLeadModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" /> Add Prospect
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Target Service</th>
                      <th className="py-3 px-4">Estimated Value</th>
                      <th className="py-3 px-4">Stage</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-slate-900">{lead.company}</td>
                        <td className="py-3 px-4 text-slate-600">{lead.contact || 'Primary Contact'}</td>
                        <td className="py-3 px-4 text-slate-600">{lead.service}</td>
                        <td className="py-3 px-4 font-bold text-emerald-600">${Number(lead.estimatedValue || 0).toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {lead.stage}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setLeads(leads.filter(l => l.id !== lead.id))}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 transition"
                            title="Delete Prospect"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: READINESS ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" /> Launch Readiness Analytics
                </h2>
                <p className="text-xs text-slate-500 mt-1">Holistic readiness metrics across tasks, assets, legal, and tooling.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Task Completion Rate</h4>
                  <div className="text-3xl font-bold text-blue-600">{stats.percent}%</div>
                  <ProgressBar value={stats.completed} max={stats.total} color="blue" size="lg" />
                  <p className="text-xs text-slate-500">{stats.completed} of {stats.total} total roadmap milestones verified.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Pipeline Deal Volume</h4>
                  <div className="text-3xl font-bold text-emerald-600">
                    ${leads.reduce((sum, l) => sum + (Number(l.estimatedValue) || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-500">Across {leads.length} active prospect accounts.</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Infrastructure Readiness</h4>
                  <div className="text-3xl font-bold text-indigo-600">
                    {equipment.filter(e => e.status === 'Acquired').length} / {equipment.length}
                  </div>
                  <ProgressBar value={equipment.filter(e => e.status === 'Acquired').length} max={equipment.length || 1} color="indigo" size="lg" />
                  <p className="text-xs text-slate-500">Key hardware and networking items procured.</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Task Notes Modal */}
      {selectedTaskForNotes && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Task Notes & Updates</h3>
            <p className="text-xs text-slate-600">{selectedTaskForNotes.title}</p>
            <textarea
              rows={4}
              value={taskNotesInput}
              onChange={(e) => setTaskNotesInput(e.target.value)}
              placeholder="Add implementation notes, blockers, or reference links..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedTaskForNotes(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={saveNotesModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      {newLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Client Prospect</h3>
            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadData.company}
                  onChange={(e) => setNewLeadData({ ...newLeadData, company: e.target.value })}
                  placeholder="e.g. Apex Logistics Corp"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Primary Contact</label>
                <input
                  type="text"
                  value={newLeadData.contact}
                  onChange={(e) => setNewLeadData({ ...newLeadData, contact: e.target.value })}
                  placeholder="e.g. David Vance, IT Director"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Estimated Deal ($)</label>
                <input
                  type="number"
                  value={newLeadData.value}
                  onChange={(e) => setNewLeadData({ ...newLeadData, value: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewLeadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                >
                  Save Prospect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <PlannerProvider>
      <MainContent />
    </PlannerProvider>
  )
}
