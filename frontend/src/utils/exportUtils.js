/**
 * Export and Import utilities for CSV and JSON backups
 */

export function exportTasksToCSV(tasks) {
  if (!tasks || !tasks.length) {
    alert('No tasks to export.')
    return
  }

  const headers = [
    'Task ID',
    'Day',
    'Week',
    'Title',
    'Priority',
    'Status',
    'Completed',
    'Estimated Time',
    'Scheduled Date',
    'Completed At',
    'Category',
    'Description',
    'Notes',
  ]

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""'
    const value = String(str).replace(/"/g, '""')
    return `"${value}"`
  }

  const rows = tasks.map((task) => [
    escapeCSV(task.id),
    escapeCSV(task.day),
    escapeCSV(task.week),
    escapeCSV(task.title),
    escapeCSV(task.priority),
    escapeCSV(task.status),
    escapeCSV(task.completed ? 'Yes' : 'No'),
    escapeCSV(task.estimatedTime),
    escapeCSV(task.scheduledDate),
    escapeCSV(task.completedAt || ''),
    escapeCSV(task.category || ''),
    escapeCSV(task.description || ''),
    escapeCSV(task.notes || ''),
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `IT_Support_Launch_Planner_Tasks_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportCompleteJSONBackup(fullState) {
  const dataStr = JSON.stringify(
    {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      appName: '30-Day IT Support Business Launch Planner',
      data: fullState,
    },
    null,
    2
  )

  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `IT_Support_Launch_Planner_Backup_${new Date().toISOString().slice(0, 10)}.json`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function importJSONBackup(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        if (parsed.data) {
          resolve(parsed.data)
        } else if (parsed.tasks) {
          resolve(parsed)
        } else {
          reject(new Error('Invalid backup file format: missing planner data.'))
        }
      } catch (err) {
        reject(new Error('Failed to parse JSON file: ' + err.message))
      }
    }
    reader.onerror = () => reject(new Error('Error reading backup file'))
    reader.readAsText(file)
  })
}

export function printChecklist(title = "Today's Launch Checklist") {
  window.print()
}
