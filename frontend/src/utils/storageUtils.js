/**
 * Storage utility functions with versioning and fallback
 */

const STORAGE_PREFIX = 'it_launch_planner_'
const STORAGE_VERSION = 'v1.0'

export const STORAGE_KEYS = {
  TASKS: `${STORAGE_PREFIX}tasks_${STORAGE_VERSION}`,
  START_DATE: `${STORAGE_PREFIX}start_date_${STORAGE_VERSION}`,
  CURRENT_DAY: `${STORAGE_PREFIX}current_day_${STORAGE_VERSION}`,
  BRANDING: `${STORAGE_PREFIX}branding_${STORAGE_VERSION}`,
  DOCUMENTS: `${STORAGE_PREFIX}documents_${STORAGE_VERSION}`,
  EQUIPMENT: `${STORAGE_PREFIX}equipment_${STORAGE_VERSION}`,
  SOFTWARE: `${STORAGE_PREFIX}software_${STORAGE_VERSION}`,
  SERVICES: `${STORAGE_PREFIX}services_${STORAGE_VERSION}`,
  LEADS: `${STORAGE_PREFIX}leads_${STORAGE_VERSION}`,
  ACTIVITY_LOG: `${STORAGE_PREFIX}activity_log_${STORAGE_VERSION}`,
  CUSTOM_SETTINGS: `${STORAGE_PREFIX}settings_${STORAGE_VERSION}`,
}

export function loadFromStorage(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null || raw === undefined) return defaultValue
    return JSON.parse(raw)
  } catch (err) {
    console.error(`Error loading from storage for key ${key}:`, err)
    return defaultValue
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`Error saving to storage for key ${key}:`, err)
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.error(`Error removing from storage for key ${key}:`, err)
  }
}

export function clearAllPlannerStorage() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
}
