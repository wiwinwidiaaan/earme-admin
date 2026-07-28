import { STORAGE_BASE_URL } from './api'

/**
 * Backend resources already return absolute *_url fields, so this is mostly
 * a safety net for any relative path that slips through.
 */
export function storageUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${STORAGE_BASE_URL}/storage/${path}`
}
