import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { INITIAL_TASKS, DAY_METADATA, WEEK_INFO } from '../data/initialTasks'
import { INITIAL_BRANDING_ASSETS } from '../data/initialBranding'
import { INITIAL_DOCUMENTS } from '../data/initialDocuments'
import { INITIAL_EQUIPMENT } from '../data/initialEquipment'
import { INITIAL_SOFTWARE } from '../data/initialSoftware'
import { INITIAL_SERVICES } from '../data/initialServices'
import { INITIAL_LEADS } from '../data/initialLeads'
import {
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
  clearAllPlannerStorage,
} from '../utils/storageUtils'
import {
  getTodayString,
  getCalculatedDate,
  calculateCurrentLaunchDay,
  isTaskOverdue,
  getDaysRemaining,
} from '../utils/dateUtils'

const PlannerContext = createContext(null)

export function PlannerProvider({ children }) {
  // 1. Launch Start Date
  const [launchStartDate, setLaunchStartDateState] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.START_DATE, getTodayString())
  })

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedDay, setSelectedDay] = useState(() => {
    return calculateCurrentLaunchDay(loadFromStorage(STORAGE_KEYS.START_DATE, getTodayString()))
  })

  // 3. Search and Global Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')

  // 4. Tasks State with Date Initialization
  const [tasks, setTasks] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.TASKS, null)
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved
    }
    // Initialize dates for INITIAL_TASKS based on launchStartDate
    const initialStart = loadFromStorage(STORAGE_KEYS.START_DATE, getTodayString())
    return INITIAL_TASKS.map((task) => ({
      ...task,
      scheduledDate: getCalculatedDate(initialStart, task.day),
    }))
  })

  // 5. Activity Log
  const [activityLog, setActivityLog] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.ACTIVITY_LOG, null)
    if (saved) return saved
    return [
      {
        id: 'act-init',
        type: 'system',
        message: '30-Day IT Support Launch Planner initialized with full blueprint.',
        timestamp: new Date().toISOString(),
      },
    ]
  })

  // 6. Specialized Module States
  const [brandingAssets, setBrandingAssets] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.BRANDING, INITIAL_BRANDING_ASSETS)
  })

  const [documents, setDocuments] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS)
  })

  const [equipment, setEquipment] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT)
  })

  const [software, setSoftware] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.SOFTWARE, INITIAL_SOFTWARE)
  })

  const [services, setServices] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.SERVICES, INITIAL_SERVICES)
  })

  const [leads, setLeads] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.LEADS, INITIAL_LEADS)
  })

  // Synchronize Tasks to Storage on Change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TASKS, tasks)
  }, [tasks])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.START_DATE, launchStartDate)
  }, [launchStartDate])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVITY_LOG, activityLog)
  }, [activityLog])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BRANDING, brandingAssets)
  }, [brandingAssets])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DOCUMENTS, documents)
  }, [documents])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EQUIPMENT, equipment)
  }, [equipment])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SOFTWARE, software)
  }, [software])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SERVICES, services)
  }, [services])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LEADS, leads)
  }, [leads])

  // Current Launch Day Calculation
  const currentLaunchDay = useMemo(() => {
    return calculateCurrentLaunchDay(launchStartDate)
  }, [launchStartDate])

  const daysRemaining = useMemo(() => {
    return getDaysRemaining(launchStartDate)
  }, [launchStartDate])

  // Helper to append activity
  const logActivity = useCallback((type, message, extra = {}) => {
    const entry = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      ...extra,
    }
    setActivityLog((prev) => [entry, ...prev.slice(0, 49)]) // Keep last 50
  }, [])

  // Change Launch Start Date & Recalculate scheduledDate for all tasks
  const setLaunchStartDate = useCallback((newStartDate) => {
    setLaunchStartDateState(newStartDate)
    setTasks((prevTasks) =>
      prevTasks.map((t) => ({
        ...t,
        scheduledDate: getCalculatedDate(newStartDate, t.day),
      }))
    )
    logActivity('settings', `Launch start date set to ${newStartDate}.`)
  }, [logActivity])

  // Task Actions
  const toggleTaskCompletion = useCallback((taskId) => {
    setTasks((prevTasks) => {
      let changedTask = null
      const updated = prevTasks.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed
          changedTask = {
            ...t,
            completed: nextCompleted,
            status: nextCompleted ? 'Completed' : 'Not Started',
            completedAt: nextCompleted ? new Date().toISOString() : null,
          }
          return changedTask
        }
        return t
      })

      if (changedTask) {
        if (changedTask.completed) {
          logActivity('task_completed', `Completed Day ${changedTask.day}: "${changedTask.title}"`, { taskId })
        } else {
          logActivity('task_undo', `Reopened task: "${changedTask.title}"`, { taskId })
        }
      }
      return updated
    })
  }, [logActivity])

  const updateTaskStatus = useCallback((taskId, newStatus) => {
    setTasks((prevTasks) => {
      let changedTask = null
      const updated = prevTasks.map((t) => {
        if (t.id === taskId) {
          const isCompleted = newStatus === 'Completed'
          changedTask = {
            ...t,
            status: newStatus,
            completed: isCompleted,
            completedAt: isCompleted ? (t.completedAt || new Date().toISOString()) : null,
          }
          return changedTask
        }
        return t
      })

      if (changedTask) {
        logActivity('status_change', `Status of "${changedTask.title}" changed to ${newStatus}`)
      }
      return updated
    })
  }, [logActivity])

  const updateTaskNotes = useCallback((taskId, notes) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, notes } : t))
    )
  }, [])

  const updateTaskPriority = useCallback((taskId, priority) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, priority } : t))
    )
  }, [])

  const updateTaskDate = useCallback((taskId, scheduledDate) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, scheduledDate } : t))
    )
  }, [])

  const editTask = useCallback((taskId, updatedFields) => {
    setTasks((prevTasks) => {
      return prevTasks.map((t) => {
        if (t.id === taskId) {
          const isCompleted = updatedFields.status === 'Completed' || updatedFields.completed
          return {
            ...t,
            ...updatedFields,
            completed: isCompleted,
            completedAt: isCompleted ? (t.completedAt || new Date().toISOString()) : null,
          }
        }
        return t
      })
    })
    logActivity('task_edit', `Updated task details for ID ${taskId}`)
  }, [logActivity])

  const addNewTask = useCallback((newTaskData) => {
    const id = `custom-task-${Date.now()}`
    const taskDay = Number(newTaskData.day) || 1
    const week = Math.ceil(taskDay / 7) <= 4 ? Math.ceil(taskDay / 7) : 4
    const scheduledDate = newTaskData.scheduledDate || getCalculatedDate(launchStartDate, taskDay)

    const fullTask = {
      id,
      day: taskDay,
      week,
      title: newTaskData.title.trim(),
      description: newTaskData.description || '',
      priority: newTaskData.priority || 'Medium',
      estimatedTime: newTaskData.estimatedTime || '1 hr',
      category: newTaskData.category || 'Custom Task',
      status: newTaskData.status || 'Not Started',
      completed: newTaskData.status === 'Completed',
      completedAt: newTaskData.status === 'Completed' ? new Date().toISOString() : null,
      notes: newTaskData.notes || '',
      scheduledDate,
      isCustom: true,
    }

    setTasks((prev) => [fullTask, ...prev])
    logActivity('task_add', `Added custom task for Day ${taskDay}: "${fullTask.title}"`)
    return fullTask
  }, [launchStartDate, logActivity])

  const deleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => {
      const taskToDelete = prevTasks.find((t) => t.id === taskId)
      if (taskToDelete) {
        logActivity('task_delete', `Removed task: "${taskToDelete.title}"`)
      }
      return prevTasks.filter((t) => t.id !== taskId)
    })
  }, [logActivity])

  // Reset all tasks or reset to factory defaults
  const resetAllProgress = useCallback(() => {
    const resetTasks = INITIAL_TASKS.map((t) => ({
      ...t,
      scheduledDate: getCalculatedDate(launchStartDate, t.day),
      status: 'Not Started',
      completed: false,
      completedAt: null,
      notes: '',
    }))
    setTasks(resetTasks)
    setActivityLog([
      {
        id: `act-reset-${Date.now()}`,
        type: 'system',
        message: 'All task progress was reset to Not Started.',
        timestamp: new Date().toISOString(),
      },
    ])
  }, [launchStartDate])

  const restoreFullState = useCallback((importedData) => {
    if (importedData.tasks) setTasks(importedData.tasks)
    if (importedData.startDate) setLaunchStartDateState(importedData.startDate)
    if (importedData.branding) setBrandingAssets(importedData.branding)
    if (importedData.documents) setDocuments(importedData.documents)
    if (importedData.equipment) setEquipment(importedData.equipment)
    if (importedData.software) setSoftware(importedData.software)
    if (importedData.services) setServices(importedData.services)
    if (importedData.leads) setLeads(importedData.leads)
    logActivity('restore', 'Restored complete planner database from backup.')
  }, [logActivity])

  // Metrics and Calculations
  const stats = useMemo(() => {
    const total = tasks.length
    let completed = 0
    let pending = 0
    let overdue = 0
    let blocked = 0
    let highPriorityPending = 0

    const todayStr = getTodayString()

    tasks.forEach((t) => {
      if (t.completed || t.status === 'Completed') {
        completed++
      } else {
        if (t.status === 'Blocked') {
          blocked++
        } else {
          pending++
        }

        if (t.priority === 'High') {
          highPriorityPending++
        }

        if (isTaskOverdue(t, currentLaunchDay, launchStartDate)) {
          overdue++
        }
      }
    })

    const overallPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

    // Today's tasks (matched to currentLaunchDay)
    const todayTasksList = tasks.filter((t) => t.day === currentLaunchDay)
    const todayCompleted = todayTasksList.filter((t) => t.completed || t.status === 'Completed').length
    const todayTotal = todayTasksList.length
    const todayPercentage = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0

    // Weekly breakdowns
    const weekStats = [1, 2, 3, 4].map((wk) => {
      const wkTasks = tasks.filter((t) => t.week === wk)
      const wkCompleted = wkTasks.filter((t) => t.completed || t.status === 'Completed').length
      const wkTotal = wkTasks.length
      const pct = wkTotal > 0 ? Math.round((wkCompleted / wkTotal) * 100) : 0
      return {
        week: wk,
        total: wkTotal,
        completed: wkCompleted,
        pending: wkTotal - wkCompleted,
        percentage: pct,
        info: WEEK_INFO.find((w) => w.week === wk),
      }
    })

    return {
      total,
      completed,
      pending,
      overdue,
      blocked,
      highPriorityPending,
      overallPercentage,
      todayTasksList,
      todayCompleted,
      todayTotal,
      todayPercentage,
      weekStats,
    }
  }, [tasks, currentLaunchDay, launchStartDate])

  // Equipment calculation
  const equipmentStats = useMemo(() => {
    let totalEstimated = 0
    let totalActual = 0
    let totalItems = equipment.length
    let purchasedCount = 0

    equipment.forEach((item) => {
      const estTotal = (item.quantityRequired || 1) * (item.estimatedPrice || 0)
      const actTotal = (item.quantityPurchased || 0) * (item.actualPrice || item.estimatedPrice || 0)
      totalEstimated += estTotal
      totalActual += actTotal

      if (item.status === 'Received' || item.status === 'In Use') {
        purchasedCount++
      }
    })

    return {
      totalEstimated,
      totalActual,
      totalItems,
      purchasedCount,
      remainingCount: totalItems - purchasedCount,
      percentage: totalItems > 0 ? Math.round((purchasedCount / totalItems) * 100) : 0,
    }
  }, [equipment])

  // Software calculation
  const softwareStats = useMemo(() => {
    let monthlySpend = 0
    let activeCount = 0
    software.forEach((s) => {
      monthlySpend += Number(s.monthlyCost) || 0
      if (s.status === 'Active') activeCount++
    })
    return {
      totalTools: software.length,
      activeCount,
      monthlySpend: Math.round(monthlySpend * 100) / 100,
    }
  }, [software])

  // Leads calculation
  const leadsStats = useMemo(() => {
    let pipelineValue = 0
    let wonCount = 0
    leads.forEach((l) => {
      pipelineValue += Number(l.estimatedValue) || 0
      if (l.status === 'Won') wonCount++
    })
    return {
      totalLeads: leads.length,
      pipelineValue,
      wonCount,
    }
  }, [leads])

  // Documents calculation
  const documentsStats = useMemo(() => {
    let readyCount = 0
    documents.forEach((d) => {
      if (d.status === 'Ready to Use' || d.status === 'Legal Approved') readyCount++
    })
    return {
      total: documents.length,
      readyCount,
      percentage: documents.length > 0 ? Math.round((readyCount / documents.length) * 100) : 0,
    }
  }, [documents])

  // Branding calculation
  const brandingStats = useMemo(() => {
    let approvedCount = 0
    brandingAssets.forEach((b) => {
      if (b.status === 'Approved') approvedCount++
    })
    return {
      total: brandingAssets.length,
      approvedCount,
      percentage: brandingAssets.length > 0 ? Math.round((approvedCount / brandingAssets.length) * 100) : 0,
    }
  }, [brandingAssets])

  // Full state object for backup
  const getFullExportState = useCallback(() => {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      startDate: launchStartDate,
      currentLaunchDay,
      tasks,
      branding: brandingAssets,
      documents,
      equipment,
      software,
      services,
      leads,
      activityLog,
    }
  }, [
    launchStartDate,
    currentLaunchDay,
    tasks,
    brandingAssets,
    documents,
    equipment,
    software,
    services,
    leads,
    activityLog,
  ])

  const value = {
    // Dates & Day navigation
    launchStartDate,
    setLaunchStartDate,
    currentLaunchDay,
    daysRemaining,
    selectedDay,
    setSelectedDay,
    DAY_METADATA,
    WEEK_INFO,

    // Navigation & Tab
    activeTab,
    setActiveTab,

    // Search & Filters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,

    // Tasks & Operations
    tasks,
    toggleTaskCompletion,
    updateTaskStatus,
    updateTaskNotes,
    updateTaskPriority,
    updateTaskDate,
    editTask,
    addNewTask,
    deleteTask,
    resetAllProgress,
    restoreFullState,
    getFullExportState,

    // Metrics
    stats,
    equipmentStats,
    softwareStats,
    leadsStats,
    documentsStats,
    brandingStats,

    // Modules state & mutators
    brandingAssets,
    setBrandingAssets,
    documents,
    setDocuments,
    equipment,
    setEquipment,
    software,
    setSoftware,
    services,
    setServices,
    leads,
    setLeads,

    // Activity
    activityLog,
    logActivity,
  }

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
}

export function usePlanner() {
  const context = useContext(PlannerContext)
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider')
  }
  return context
}
