import { useState, useMemo, useCallback } from 'react'

/* ================================================================
   TEST CHECKLIST ITEMS
   ================================================================ */
const TEST_ITEMS = [
    { id: 'prefs-persist', label: 'Preferences persist after refresh', hint: 'Go to Settings → save preferences → refresh → verify fields are prefilled.' },
    { id: 'match-score', label: 'Match score calculates correctly', hint: 'Set preferences, go to Dashboard → verify scores appear on cards with correct color tiers.' },
    { id: 'match-toggle', label: '"Show only matches" toggle works', hint: 'Enable toggle on Dashboard → only jobs above your threshold should remain visible.' },
    { id: 'save-persist', label: 'Save job persists after refresh', hint: 'Save a job on Dashboard → refresh → go to Saved → verify the job is still there.' },
    { id: 'apply-tab', label: 'Apply opens in new tab', hint: 'Click "Apply" on any job card → verify link opens in a new browser tab.' },
    { id: 'status-persist', label: 'Status update persists after refresh', hint: 'Change a job status to "Applied" → refresh → verify the blue badge is still shown.' },
    { id: 'status-filter', label: 'Status filter works correctly', hint: 'Set a job to "Applied" → use Status filter dropdown → only "Applied" jobs should show.' },
    { id: 'digest-top10', label: 'Digest generates top 10 by score', hint: 'Generate digest → verify 10 jobs listed in descending match score order.' },
    { id: 'digest-persist', label: 'Digest persists for the day', hint: 'Generate digest → refresh the page → verify the same digest loads without regenerating.' },
    { id: 'no-console-errors', label: 'No console errors on main pages', hint: 'Open DevTools Console → navigate all pages → verify zero errors.' },
]

/* ================================================================
   BUILD STEPS
   ================================================================ */
const BUILD_STEPS = [
    { id: 'step-1', label: 'Design System Defined', check: () => true },
    { id: 'step-2', label: 'Route Skeleton Built', check: () => true },
    { id: 'step-3', label: 'Realistic Dataset Loaded (60 jobs)', check: () => true },
    { id: 'step-4', label: 'Dashboard Rendering + Filters', check: () => true },
    { id: 'step-5', label: 'Preference Logic + Match Scoring', check: () => !!localStorage.getItem('jobTrackerPreferences') },
    { id: 'step-6', label: 'Daily Digest Engine', check: () => { try { return Object.keys(localStorage).some(k => k.startsWith('jobTrackerDigest_')) } catch { return false } } },
    { id: 'step-7', label: 'Status Tracking + Notifications', check: () => true },
    { id: 'step-8', label: 'Test Checklist Enforced', check: () => { try { const c = JSON.parse(localStorage.getItem('jobTrackerTestChecklist') || '{}'); return Object.values(c).filter(Boolean).length === 10 } catch { return false } } },
]

/* ================================================================
   STORAGE KEYS
   ================================================================ */
const CHECKLIST_KEY = 'jobTrackerTestChecklist'
const ARTIFACTS_KEY = 'jobTrackerArtifacts'

function loadChecklist() {
    try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}') } catch { return {} }
}
function saveChecklist(d) { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(d)) }

function loadArtifacts() {
    try { return JSON.parse(localStorage.getItem(ARTIFACTS_KEY) || '{}') } catch { return {} }
}
function saveArtifacts(d) { localStorage.setItem(ARTIFACTS_KEY, JSON.stringify(d)) }

function isValidUrl(str) {
    if (!str || !str.trim()) return false
    try {
        const u = new URL(str.trim())
        return u.protocol === 'http:' || u.protocol === 'https:'
    } catch { return false }
}

/* ================================================================
   COMPONENT
   ================================================================ */
function Proof() {
    const [checked, setChecked] = useState(() => loadChecklist())
    const [artifacts, setArtifacts] = useState(() => loadArtifacts())
    const [copied, setCopied] = useState(false)
    const [urlErrors, setUrlErrors] = useState({})

    // Test checklist
    const passedCount = useMemo(() => TEST_ITEMS.filter(t => checked[t.id]).length, [checked])
    const allTestsPassed = passedCount === TEST_ITEMS.length

    const toggleItem = (id) => {
        setChecked(prev => { const n = { ...prev, [id]: !prev[id] }; saveChecklist(n); return n })
    }
    const resetTests = () => { saveChecklist({}); setChecked({}) }

    // Build steps
    const stepStatuses = useMemo(() => BUILD_STEPS.map(s => ({ ...s, completed: s.check() })), [checked, artifacts])
    const completedSteps = stepStatuses.filter(s => s.completed).length

    // Artifacts
    const handleArtifactChange = (key, value) => {
        setArtifacts(prev => { const n = { ...prev, [key]: value }; saveArtifacts(n); return n })
        setUrlErrors(prev => ({ ...prev, [key]: false }))
    }

    const validateArtifact = (key) => {
        if (artifacts[key] && !isValidUrl(artifacts[key])) {
            setUrlErrors(prev => ({ ...prev, [key]: true }))
        }
    }

    const lovableValid = isValidUrl(artifacts.lovable)
    const githubValid = isValidUrl(artifacts.github)
    const deployedValid = isValidUrl(artifacts.deployed)
    const allLinksProvided = lovableValid && githubValid && deployedValid

    // Ship status
    const shipStatus = useMemo(() => {
        if (allTestsPassed && allLinksProvided) return 'Shipped'
        if (completedSteps > 0 || passedCount > 0) return 'In Progress'
        return 'Not Started'
    }, [allTestsPassed, allLinksProvided, completedSteps, passedCount])

    // Copy submission
    const handleCopy = useCallback(async () => {
        const text = `──────────────────────────────────────────
Job Notification Tracker — Final Submission
──────────────────────────────────────────

Lovable Project:
${artifacts.lovable || '(not provided)'}

GitHub Repository:
${artifacts.github || '(not provided)'}

Live Deployment:
${artifacts.deployed || '(not provided)'}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced

Tests Passed: ${passedCount} / ${TEST_ITEMS.length}
Build Steps: ${completedSteps} / ${BUILD_STEPS.length}
Ship Status: ${shipStatus}
──────────────────────────────────────────`

        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
        } catch {
            const ta = document.createElement('textarea')
            ta.value = text
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
        }
    }, [artifacts, passedCount, completedSteps, shipStatus])

    const shipBadgeClass = shipStatus === 'Shipped' ? 'ship-status--shipped' : shipStatus === 'In Progress' ? 'ship-status--progress' : 'ship-status--notstarted'

    return (
        <div className="page-shell">
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="page-title">Proof</h1>
                        <p className="page-subtitle">Project 1 — Job Notification Tracker</p>
                    </div>
                    <span className={`ship-status-badge ${shipBadgeClass}`}>{shipStatus}</span>
                </div>
            </div>
            <div className="page-body">

                {/* ============= SECTION A: STEP COMPLETION ============= */}
                <div className="proof-section">
                    <h2 className="proof-section-title">Step Completion Summary</h2>
                    <p className="proof-section-desc">{completedSteps} of {BUILD_STEPS.length} steps completed.</p>
                    <div className="step-list">
                        {stepStatuses.map((step, idx) => (
                            <div className={`step-item ${step.completed ? 'step-item--done' : ''}`} key={step.id}>
                                <span className="step-item-num">{idx + 1}</span>
                                <span className="step-item-label">{step.label}</span>
                                <span className={`step-item-badge ${step.completed ? 'step-badge--done' : 'step-badge--pending'}`}>
                                    {step.completed ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ============= SECTION B: ARTIFACT LINKS ============= */}
                <div className="proof-section">
                    <h2 className="proof-section-title">Artifact Collection</h2>
                    <p className="proof-section-desc">Provide all three links to finalize your submission.</p>

                    <div className="artifact-form">
                        <div className="artifact-group">
                            <label className="input-label" htmlFor="artifact-lovable">Lovable Project Link</label>
                            <input
                                className={`input-field ${urlErrors.lovable ? 'input-field--error' : ''} ${lovableValid ? 'input-field--valid' : ''}`}
                                id="artifact-lovable"
                                type="url"
                                placeholder="https://lovable.dev/projects/..."
                                value={artifacts.lovable || ''}
                                onChange={e => handleArtifactChange('lovable', e.target.value)}
                                onBlur={() => validateArtifact('lovable')}
                            />
                            {urlErrors.lovable && <span className="input-error">Please enter a valid URL.</span>}
                        </div>

                        <div className="artifact-group">
                            <label className="input-label" htmlFor="artifact-github">GitHub Repository Link</label>
                            <input
                                className={`input-field ${urlErrors.github ? 'input-field--error' : ''} ${githubValid ? 'input-field--valid' : ''}`}
                                id="artifact-github"
                                type="url"
                                placeholder="https://github.com/username/repo"
                                value={artifacts.github || ''}
                                onChange={e => handleArtifactChange('github', e.target.value)}
                                onBlur={() => validateArtifact('github')}
                            />
                            {urlErrors.github && <span className="input-error">Please enter a valid URL.</span>}
                        </div>

                        <div className="artifact-group">
                            <label className="input-label" htmlFor="artifact-deployed">Deployed URL</label>
                            <input
                                className={`input-field ${urlErrors.deployed ? 'input-field--error' : ''} ${deployedValid ? 'input-field--valid' : ''}`}
                                id="artifact-deployed"
                                type="url"
                                placeholder="https://username.github.io/project/"
                                value={artifacts.deployed || ''}
                                onChange={e => handleArtifactChange('deployed', e.target.value)}
                                onBlur={() => validateArtifact('deployed')}
                            />
                            {urlErrors.deployed && <span className="input-error">Please enter a valid URL.</span>}
                        </div>
                    </div>
                </div>

                {/* ============= SECTION C: TEST CHECKLIST ============= */}
                <div className="proof-section">
                    <h2 className="proof-section-title">Test Checklist</h2>
                    <p className="proof-section-desc">{passedCount} of {TEST_ITEMS.length} tests passed.</p>

                    {/* Progress Bar */}
                    <div className="test-progress-bar">
                        <div className="test-progress-fill" style={{ width: `${(passedCount / TEST_ITEMS.length) * 100}%` }}></div>
                    </div>

                    <div className="test-checklist" id="test-checklist">
                        {TEST_ITEMS.map((item, idx) => (
                            <div className={`test-item ${checked[item.id] ? 'test-item--checked' : ''}`} key={item.id} id={`test-${item.id}`}>
                                <button className="test-item-checkbox" onClick={() => toggleItem(item.id)} aria-label={`Toggle ${item.label}`}>
                                    {checked[item.id] ? (
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" rx="4" fill="currentColor" stroke="currentColor" strokeWidth="1" /><path d="M5 9l3 3 5-6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>
                                    )}
                                </button>
                                <div className="test-item-content">
                                    <div className="test-item-row">
                                        <span className="test-item-index">{idx + 1}.</span>
                                        <span className={`test-item-label ${checked[item.id] ? 'test-item-label--done' : ''}`}>{item.label}</span>
                                    </div>
                                    <p className="test-item-hint">{item.hint}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="test-actions">
                        <button className="btn btn-secondary btn-sm" onClick={resetTests} id="btn-reset-tests">Reset Test Status</button>
                    </div>
                </div>

                {/* ============= SECTION D: FINAL SUBMISSION ============= */}
                <div className="proof-section">
                    <h2 className="proof-section-title">Final Submission</h2>

                    {/* Requirements checklist */}
                    <div className="submission-reqs">
                        <div className={`submission-req ${allLinksProvided ? 'submission-req--met' : ''}`}>
                            {allLinksProvided ? (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.1" /><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" /></svg>
                            )}
                            <span>All 3 artifact links provided</span>
                        </div>
                        <div className={`submission-req ${allTestsPassed ? 'submission-req--met' : ''}`}>
                            {allTestsPassed ? (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.1" /><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" /></svg>
                            )}
                            <span>All 10 test checklist items passed</span>
                        </div>
                    </div>

                    {/* Copy button */}
                    <div className="submission-actions">
                        <button
                            className={`btn ${shipStatus === 'Shipped' ? 'btn-primary' : 'btn-secondary'} ${copied ? 'btn-success' : ''}`}
                            onClick={handleCopy}
                            id="btn-copy-submission"
                        >
                            {copied ? '✓ Copied to Clipboard' : 'Copy Final Submission'}
                        </button>
                    </div>
                </div>

                {/* ============= SHIP CARD ============= */}
                <div className={`ship-card ${shipStatus === 'Shipped' ? 'ship-card--unlocked' : 'ship-card--locked'}`} id="ship-card">
                    {shipStatus === 'Shipped' ? (
                        <>
                            <div className="ship-card-icon ship-card-icon--unlock">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <rect x="8" y="18" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M14 18v-5a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="20" cy="27" r="2" fill="currentColor" />
                                </svg>
                            </div>
                            <h3 className="ship-card-title">Project 1 Shipped Successfully.</h3>
                            <p className="ship-card-text">
                                All tests verified. All artifacts collected. Your Job Notification Tracker is complete.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="ship-card-icon ship-card-icon--lock">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <rect x="8" y="18" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M14 18v-5a6 6 0 0112 0v5" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="20" cy="27" r="2" fill="currentColor" />
                                </svg>
                            </div>
                            <h3 className="ship-card-title">Ship Locked</h3>
                            <p className="ship-card-text">
                                {!allLinksProvided && !allTestsPassed && 'Provide all 3 artifact links and pass all 10 tests to ship.'}
                                {!allLinksProvided && allTestsPassed && 'Provide all 3 artifact links to ship.'}
                                {allLinksProvided && !allTestsPassed && `Pass all 10 tests to ship. ${TEST_ITEMS.length - passedCount} remaining.`}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Proof
