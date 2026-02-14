import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import jobs from '../data/jobs'
import JobCard from '../components/JobCard'
import JobModal from '../components/JobModal'
import FilterBar from '../components/FilterBar'
import Toast from '../components/Toast'
import { computeMatchScore, loadPreferences, extractSalaryNumeric } from '../utils/matchEngine'
import { getAllStatuses, setJobStatus, getJobStatus } from '../utils/statusEngine'

function Dashboard() {
    const [selectedJob, setSelectedJob] = useState(null)
    const [showOnlyMatches, setShowOnlyMatches] = useState(false)
    const [toastMsg, setToastMsg] = useState(null)
    const [statusVersion, setStatusVersion] = useState(0)

    const [savedIds, setSavedIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('savedJobs')) || []
        } catch {
            return []
        }
    })

    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        mode: '',
        experience: '',
        source: '',
        status: '',
        sort: 'latest',
    })

    const preferences = useMemo(() => loadPreferences(), [])

    // Re-read statuses whenever statusVersion bumps
    const allStatuses = useMemo(() => getAllStatuses(), [statusVersion])

    const toggleSave = useCallback((id) => {
        setSavedIds(prev => {
            const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            localStorage.setItem('savedJobs', JSON.stringify(next))
            return next
        })
    }, [])

    const handleStatusChange = useCallback((jobId, status) => {
        setJobStatus(jobId, status)
        setStatusVersion(v => v + 1)
        if (status !== 'Not Applied') {
            setToastMsg(`Status updated: ${status}`)
        }
    }, [])

    const scoredJobs = useMemo(() => {
        return jobs.map(job => {
            const result = computeMatchScore(job, preferences)
            return {
                ...job,
                matchScore: result ? result.score : null,
                matchBreakdown: result ? result.breakdown : [],
            }
        })
    }, [preferences])

    const filteredJobs = useMemo(() => {
        let result = [...scoredJobs]

        if (filters.keyword) {
            const kw = filters.keyword.toLowerCase()
            result = result.filter(j =>
                j.title.toLowerCase().includes(kw) ||
                j.company.toLowerCase().includes(kw)
            )
        }

        if (filters.location) {
            result = result.filter(j => j.location === filters.location)
        }

        if (filters.mode) {
            result = result.filter(j => j.mode === filters.mode)
        }

        if (filters.experience) {
            result = result.filter(j => j.experience === filters.experience)
        }

        if (filters.source) {
            result = result.filter(j => j.source === filters.source)
        }

        // Status filter (AND)
        if (filters.status) {
            result = result.filter(j => {
                const s = allStatuses[j.id]?.status || 'Not Applied'
                return s === filters.status
            })
        }

        // Match threshold filter
        if (showOnlyMatches && preferences) {
            const threshold = preferences.minMatchScore ?? 40
            result = result.filter(j => j.matchScore !== null && j.matchScore >= threshold)
        }

        // Sorting
        if (filters.sort === 'latest') {
            result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo)
        } else if (filters.sort === 'oldest') {
            result.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo)
        } else if (filters.sort === 'score') {
            result.sort((a, b) => (b.matchScore ?? -1) - (a.matchScore ?? -1))
        } else if (filters.sort === 'salary') {
            result.sort((a, b) => extractSalaryNumeric(b.salaryRange) - extractSalaryNumeric(a.salaryRange))
        }

        return result
    }, [scoredJobs, filters, showOnlyMatches, preferences, allStatuses])

    const hasPreferences = preferences !== null

    return (
        <div className="page-shell">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Your matched jobs appear here, refreshed daily.</p>
            </div>
            <div className="page-body">
                {!hasPreferences && (
                    <div className="prefs-banner" id="prefs-banner">
                        <div className="prefs-banner-content">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <div>
                                <strong>Set your preferences to activate intelligent matching.</strong>
                                <span> Jobs will be scored based on your role, location, mode, experience, and skills.</span>
                            </div>
                        </div>
                        <Link to="/settings" className="btn btn-primary btn-sm">Set Preferences</Link>
                    </div>
                )}

                <FilterBar
                    filters={filters}
                    onFilterChange={setFilters}
                    jobCount={filteredJobs.length}
                    hasPreferences={hasPreferences}
                    showOnlyMatches={showOnlyMatches}
                    onToggleMatches={() => setShowOnlyMatches(prev => !prev)}
                />

                <div className="job-grid">
                    {filteredJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onView={setSelectedJob}
                            onSave={toggleSave}
                            isSaved={savedIds.includes(job.id)}
                            matchScore={job.matchScore}
                            matchBreakdown={job.matchBreakdown}
                            jobStatus={allStatuses[job.id]?.status || 'Not Applied'}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <div className="empty-state-card">
                        <div className="empty-state-icon-wrap">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <circle cx="24" cy="20" r="10" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M31 27l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h3 className="empty-state-title">
                            {showOnlyMatches ? 'No roles match your criteria' : 'No matching jobs'}
                        </h3>
                        <p className="empty-state-text">
                            {showOnlyMatches
                                ? 'Adjust your filters or lower your match threshold in Settings.'
                                : 'Try adjusting your filters or broadening your search criteria.'
                            }
                        </p>
                    </div>
                )}
            </div>

            {selectedJob && (
                <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}

            {toastMsg && (
                <Toast message={toastMsg} onDone={() => setToastMsg(null)} />
            )}
        </div>
    )
}

export default Dashboard
