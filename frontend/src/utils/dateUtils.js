/**
 * Date utility functions for 30-Day Launch Planner
 */

export function getTodayString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDate(dateStr) {
  if (!dateStr) return 'Not set'
  try {
    const parts = dateStr.split('T')[0].split('-')
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function formatDateTime(isoStr) {
  if (!isoStr) return ''
  try {
    const d = new Date(isoStr)
    if (isNaN(d.getTime())) return isoStr
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoStr
  }
}

/**
 * Calculates scheduled date given launch start date and day number (1-30)
 */
export function getCalculatedDate(startDateStr, dayNumber) {
  if (!startDateStr) return getTodayString()
  try {
    const [y, m, d] = startDateStr.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    date.setDate(date.getDate() + (dayNumber - 1))
    const resY = date.getFullYear()
    const resM = String(date.getMonth() + 1).padStart(2, '0')
    const resD = String(date.getDate()).padStart(2, '0')
    return `${resY}-${resM}-${resD}`
  } catch {
    return startDateStr
  }
}

/**
 * Calculates the current launch day (1 to 30) based on start date
 */
export function calculateCurrentLaunchDay(startDateStr) {
  if (!startDateStr) return 1
  try {
    const [y, m, d] = startDateStr.split('-').map(Number)
    const start = new Date(y, m - 1, d)
    start.setHours(0, 0, 0, 0)
    
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    
    const diffTime = now.getTime() - start.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    const currentDay = diffDays + 1
    if (currentDay < 1) return 1
    if (currentDay > 30) return 30
    return currentDay
  } catch {
    return 1
  }
}

/**
 * Checks if a task is overdue
 */
export function isTaskOverdue(task, currentLaunchDay, startDateStr) {
  if (task.completed || task.status === 'Completed') return false
  
  const todayStr = getTodayString()
  if (task.scheduledDate && task.scheduledDate < todayStr) {
    return true
  }
  
  if (task.day && task.day < currentLaunchDay) {
    return true
  }
  
  return false
}

/**
 * Returns days remaining until Day 30
 */
export function getDaysRemaining(startDateStr) {
  const currentDay = calculateCurrentLaunchDay(startDateStr)
  return Math.max(0, 30 - currentDay)
}
