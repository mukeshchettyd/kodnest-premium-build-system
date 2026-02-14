import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import jobs from '../data/jobs'
import { computeMatchScore, loadPreferences } from '../utils/matchEngine'
import { getRecentStatusUpdates, getStatusBadgeClass } from '../utils/statusEngine'

function getTodayKey() {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
}

function formatDate(key) {
    const [y, m, d] = key.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`
}

function buildDigestJobs(preferences) {
    if (!preferences) return []

    const scored = jobs.map(job => {
        const result = computeMatchScore(job, preferences)
        return { ...job, matchScore: result ? result.score : 0 }
    })

    scored.sort((a, b) => {
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore
        return a.postedDaysAgo - b.postedDaysAgo
    })

    return scored.slice(0, 10)
}

function digestToPlainText(digestJobs, dateStr) {
    let text = `Top 10 Jobs For You — 9AM Digest\n`
    text += `${formatDate(dateStr)}\n`
    text += `${'─'.repeat(40)}\n\n`

    digestJobs.forEach((job, i) => {
        text += `${i + 1}. ${job.title}\n`
        text += `   Company:    ${job.company}\n`
        text += `   Location:   ${job.location} (${job.mode})\n`
        text += `   Experience: ${job.experience}\n`
        text += `   Salary:     ${job.salaryRange}\n`
        text += `   Match:      ${job.matchScore}%\n`
        text += `   Apply:      ${job.applyUrl}\n\n`
    })

    text += `${'─'.repeat(40)}\n`
    text += `This digest was generated based on your preferences.\n`
    text += `Demo Mode: Daily 9AM trigger simulated manually.`
    return text
}

function formatRelativeTime(isoStr) {
    const diff = Date.now() - new Date(isoStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
}

function Digest() {
    const preferences = useMemo(() => loadPreferences(), [])
    const todayKey = getTodayKey()
    const storageKey = `jobTrackerDigest_${todayKey}`

    const [digestData, setDigestData] = useState(() => {
        try {
            const raw = localStorage.getItem(storageKey)
            if (raw) return JSON.parse(raw)
        } catch { /* ignore */ }
        return null
    })

    const [copied, setCopied] = useState(false)

    const recentUpdates = useMemo(() => {
        const updates = getRecentStatusUpdates(10)
        return updates.map(u => {
            const job = jobs.find(j => j.id === u.jobId)
            return { ...u, job }
        }).filter(u => u.job)
    }, [])

    const generateDigest = useCallback(() => {
        const topJobs = buildDigestJobs(preferences)
        const data = {
            date: todayKey,
            generatedAt: new Date().toISOString(),
            jobs: topJobs,
        }
        localStorage.setItem(storageKey, JSON.stringify(data))
        setDigestData(data)
    }, [preferences, todayKey, storageKey])

    const handleCopy = useCallback(async () => {
        if (!digestData) return
        const text = digestToPlainText(digestData.jobs, digestData.date)
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        } catch {
            // Fallback
            const ta = document.createElement('textarea')
            ta.value = text
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        }
    }, [digestData])

    const handleEmailDraft = useCallback(() => {
        if (!digestData) return
        const text = digestToPlainText(digestData.jobs, digestData.date)
        const subject = encodeURIComponent('My 9AM Job Digest')
        const body = encodeURIComponent(text)
        window.open(`mailto:?subject=${subject}&body=${body}`, '_self')
    }, [digestData])

    const hasPreferences = preferences !== null

    // No preferences state
    if (!hasPreferences) {
        return (
            <div className="page-shell">
                <div className="page-header">
                    <h1 className="page-title">Digest</h1>
                    <p className="page-subtitle">Your curated daily job digest, delivered at 9AM.</p>
                </div>
                <div className="page-body">
                    <div className="empty-state-card">
                        <div className="empty-state-icon-wrap">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect x="10" y="8" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M18 18h12M18 24h12M18 30h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <circle cx="36" cy="12" r="6" fill="currentColor" opacity="0.15" />
                                <path d="M34 12h4M36 10v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h3 className="empty-state-title">Set preferences to generate a personalized digest</h3>
                        <p className="empty-state-text">
                            Your daily digest is powered by your role keywords, locations, and skills.
                            Configure them first.
                        </p>
                        <Link to="/settings" className="btn btn-primary" style={{ marginTop: '16px' }}>
                            Set Preferences
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Main digest view
    return (
        <div className="page-shell">
            <div className="page-header">
                <h1 className="page-title">Digest</h1>
                <p className="page-subtitle">Your curated daily job digest, delivered at 9AM.</p>
            </div>
            <div className="page-body">
                {/* Generate button (shown when no digest for today) */}
                {!digestData && (
                    <div className="digest-generate">
                        <div className="digest-generate-content">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                                <path d="M20 12v8l5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <div>
                                <h3 className="digest-generate-title">Ready to generate today's digest</h3>
                                <p className="digest-generate-text">
                                    We'll pick the top 10 jobs matching your preferences, sorted by relevance and freshness.
                                </p>
                            </div>
                        </div>
                        <button className="btn btn-primary" id="btn-generate-digest" onClick={generateDigest}>
                            Generate Today's 9AM Digest (Simulated)
                        </button>
                    </div>
                )}

                {/* Digest content */}
                {digestData && (
                    <>
                        {/* Action bar */}
                        <div className="digest-actions">
                            <button
                                className={`btn btn-secondary btn-sm ${copied ? 'btn-success' : ''}`}
                                onClick={handleCopy}
                                id="btn-copy-digest"
                            >
                                {copied ? '✓ Copied' : 'Copy Digest to Clipboard'}
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={handleEmailDraft} id="btn-email-digest">
                                Create Email Draft
                            </button>
                        </div>

                        {/* Email-style card */}
                        <div className="digest-card" id="digest-card">
                            <div className="digest-card-header">
                                <div className="digest-card-eyebrow">9AM DIGEST</div>
                                <h2 className="digest-card-title">Top 10 Jobs For You</h2>
                                <p className="digest-card-date">{formatDate(digestData.date)}</p>
                            </div>

                            <div className="digest-card-body">
                                {digestData.jobs.length > 0 ? (
                                    digestData.jobs.map((job, idx) => (
                                        <div className="digest-item" key={job.id} id={`digest-item-${job.id}`}>
                                            <div className="digest-item-rank">{idx + 1}</div>
                                            <div className="digest-item-content">
                                                <div className="digest-item-top">
                                                    <h4 className="digest-item-title">{job.title}</h4>
                                                    <span className={`score-badge score-badge--${job.matchScore >= 80 ? 'high' :
                                                        job.matchScore >= 60 ? 'medium' :
                                                            job.matchScore >= 40 ? 'low' : 'minimal'
                                                        }`}>
                                                        {job.matchScore}%
                                                    </span>
                                                </div>
                                                <p className="digest-item-company">{job.company}</p>
                                                <div className="digest-item-meta">
                                                    <span>{job.location} · {job.mode}</span>
                                                    <span>{job.experience}</span>
                                                    <span>{job.salaryRange}</span>
                                                </div>
                                            </div>
                                            <a
                                                className="btn btn-primary btn-sm"
                                                href={job.applyUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Apply
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <div className="digest-empty">
                                        <h4 className="digest-empty-title">No matching roles today</h4>
                                        <p className="digest-empty-text">Check again tomorrow or adjust your preferences.</p>
                                    </div>
                                )}
                            </div>

                            <div className="digest-card-footer">
                                <p>This digest was generated based on your preferences.</p>
                                <span className="digest-demo-note">Demo Mode: Daily 9AM trigger simulated manually.</span>
                            </div>
                        </div>
                    </>
                )}

                {/* Recent Status Updates */}
                {recentUpdates.length > 0 && (
                    <div className="status-updates-section">
                        <h3 className="status-updates-title">Recent Status Updates</h3>
                        <div className="status-updates-card">
                            {recentUpdates.map((u, idx) => (
                                <div className="status-update-item" key={`${u.jobId}-${idx}`}>
                                    <div className="status-update-info">
                                        <div className="status-update-job">{u.job.title}</div>
                                        <div className="status-update-company">{u.job.company}</div>
                                    </div>
                                    <div className="status-update-right">
                                        <span className={`status-btn ${getStatusBadgeClass(u.status)}`} style={{ cursor: 'default', fontSize: '11px' }}>
                                            {u.status}
                                        </span>
                                        <span className="status-update-date">{formatRelativeTime(u.updatedAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Digest
