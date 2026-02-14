/**
 * KodNest Premium — Job Status Engine
 *
 * Stores status per job in localStorage:
 *   jobTrackerStatuses = { [jobId]: { status, updatedAt } }
 *
 * Valid statuses: "Not Applied" | "Applied" | "Rejected" | "Selected"
 */

const STORAGE_KEY = 'jobTrackerStatuses'

const VALID_STATUSES = ['Not Applied', 'Applied', 'Rejected', 'Selected']

export { VALID_STATUSES }

function loadAllStatuses() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return {}
        return JSON.parse(raw)
    } catch {
        return {}
    }
}

function saveAllStatuses(statuses) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))
}

/**
 * Get status for a single job. Returns "Not Applied" if not set.
 */
export function getJobStatus(jobId) {
    const all = loadAllStatuses()
    return all[jobId]?.status || 'Not Applied'
}

/**
 * Load all statuses as a map: { [jobId]: { status, updatedAt } }
 */
export function getAllStatuses() {
    return loadAllStatuses()
}

/**
 * Set status for a single job. Returns the full entry.
 */
export function setJobStatus(jobId, status) {
    const all = loadAllStatuses()
    all[jobId] = {
        status,
        updatedAt: new Date().toISOString(),
    }
    saveAllStatuses(all)
    return all[jobId]
}

/**
 * Get recent status updates (Applied, Rejected, Selected only), sorted newest first.
 * Returns array of { jobId, status, updatedAt }
 */
export function getRecentStatusUpdates(limit = 20) {
    const all = loadAllStatuses()
    const entries = Object.entries(all)
        .filter(([, val]) => val.status !== 'Not Applied')
        .map(([jobId, val]) => ({
            jobId: parseInt(jobId, 10),
            status: val.status,
            updatedAt: val.updatedAt,
        }))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

    return entries.slice(0, limit)
}

/**
 * Get badge color class for a given status.
 */
export function getStatusBadgeClass(status) {
    switch (status) {
        case 'Applied': return 'status-badge--applied'
        case 'Rejected': return 'status-badge--rejected'
        case 'Selected': return 'status-badge--selected'
        default: return 'status-badge--default'
    }
}
