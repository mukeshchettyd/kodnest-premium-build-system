import { useState, useRef, useEffect } from 'react'
import { getScoreTier } from '../utils/matchEngine'
import { VALID_STATUSES, getStatusBadgeClass } from '../utils/statusEngine'

function JobCard({ job, onView, onSave, isSaved, matchScore, matchBreakdown, jobStatus, onStatusChange }) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropRef = useRef(null)

    const daysLabel = job.postedDaysAgo === 0
        ? 'Today'
        : job.postedDaysAgo === 1
            ? '1 day ago'
            : `${job.postedDaysAgo} days ago`

    const sourceClass = job.source === 'LinkedIn'
        ? 'badge-accent'
        : job.source === 'Naukri'
            ? 'badge-warning'
            : 'badge-neutral'

    const scoreTier = matchScore !== null && matchScore !== undefined ? getScoreTier(matchScore) : null
    const currentStatus = jobStatus || 'Not Applied'
    const statusBadgeClass = getStatusBadgeClass(currentStatus)

    // Close dropdown on outside click
    useEffect(() => {
        if (!dropdownOpen) return
        const handleClick = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [dropdownOpen])

    const handleStatusSelect = (status) => {
        setDropdownOpen(false)
        if (status !== currentStatus && onStatusChange) {
            onStatusChange(job.id, status)
        }
    }

    return (
        <div className="job-card" id={`job-card-${job.id}`}>
            <div className="job-card-header">
                <div className="job-card-title-group">
                    <h3 className="job-card-title">{job.title}</h3>
                    <span className="job-card-company">{job.company}</span>
                </div>
                <div className="job-card-badges">
                    {scoreTier && (
                        <span className={`score-badge score-badge--${scoreTier}`} title={`Match Score: ${matchScore}%`}>
                            {matchScore}%
                        </span>
                    )}
                    <span className={`badge ${sourceClass}`}>{job.source}</span>
                </div>
            </div>

            <div className="job-card-meta">
                <span className="job-card-meta-item">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5C4.5 1.5 2.5 3.5 2.5 6c0 3.5 4.5 6.5 4.5 6.5s4.5-3 4.5-6.5c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.2" /><circle cx="7" cy="5.8" r="1.5" stroke="currentColor" strokeWidth="1.2" /></svg>
                    {job.location} · {job.mode}
                </span>
                <span className="job-card-meta-item">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="4" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><path d="M5 4V2.5a1 1 0 011-1h2a1 1 0 011 1V4" stroke="currentColor" strokeWidth="1.2" /></svg>
                    {job.experience}
                </span>
                <span className="job-card-meta-item">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M3 4h8M4 7.5h6M5 11h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                    {job.salaryRange}
                </span>
            </div>

            <div className="job-card-footer">
                <span className="job-card-time">{daysLabel}</span>
                <div className="job-card-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => onView(job)}>
                        View
                    </button>
                    <button
                        className={`btn btn-sm ${isSaved ? 'btn-success' : 'btn-secondary'}`}
                        onClick={() => onSave(job.id)}
                    >
                        {isSaved ? '✓ Saved' : 'Save'}
                    </button>
                    <a
                        className="btn btn-primary btn-sm"
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Apply
                    </a>
                </div>
            </div>

            {/* Status Row */}
            <div className="job-card-status-row">
                <span className="job-card-status-label">Status</span>
                <div className="status-selector" ref={dropRef}>
                    <button
                        className={`status-btn ${statusBadgeClass}`}
                        onClick={() => setDropdownOpen(prev => !prev)}
                        aria-expanded={dropdownOpen}
                        aria-haspopup="listbox"
                    >
                        {currentStatus}
                        <svg viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    {dropdownOpen && (
                        <div className="status-dropdown" role="listbox">
                            {VALID_STATUSES.map(s => (
                                <button
                                    key={s}
                                    className={`status-option ${s === currentStatus ? 'status-option--active' : ''}`}
                                    role="option"
                                    aria-selected={s === currentStatus}
                                    onClick={() => handleStatusSelect(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default JobCard
