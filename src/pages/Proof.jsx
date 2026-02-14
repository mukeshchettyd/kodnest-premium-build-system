import { useState, useMemo } from 'react'

const TEST_ITEMS = [
    {
        id: 'prefs-persist',
        label: 'Preferences persist after refresh',
        hint: 'Go to Settings → save preferences → refresh → verify fields are prefilled.',
    },
    {
        id: 'match-score',
        label: 'Match score calculates correctly',
        hint: 'Set preferences, go to Dashboard → verify scores appear on cards with correct color tiers.',
    },
    {
        id: 'match-toggle',
        label: '"Show only matches" toggle works',
        hint: 'Enable toggle on Dashboard → only jobs above your threshold should remain visible.',
    },
    {
        id: 'save-persist',
        label: 'Save job persists after refresh',
        hint: 'Save a job on Dashboard → refresh → go to Saved → verify the job is still there.',
    },
    {
        id: 'apply-tab',
        label: 'Apply opens in new tab',
        hint: 'Click "Apply" on any job card → verify link opens in a new browser tab.',
    },
    {
        id: 'status-persist',
        label: 'Status update persists after refresh',
        hint: 'Change a job status to "Applied" → refresh → verify the blue badge is still shown.',
    },
    {
        id: 'status-filter',
        label: 'Status filter works correctly',
        hint: 'Set a job to "Applied" → use Status filter dropdown → only "Applied" jobs should show.',
    },
    {
        id: 'digest-top10',
        label: 'Digest generates top 10 by score',
        hint: 'Generate digest → verify 10 jobs listed in descending match score order.',
    },
    {
        id: 'digest-persist',
        label: 'Digest persists for the day',
        hint: 'Generate digest → refresh the page → verify the same digest loads without regenerating.',
    },
    {
        id: 'no-console-errors',
        label: 'No console errors on main pages',
        hint: 'Open DevTools Console → navigate all pages → verify zero errors.',
    },
]

const STORAGE_KEY = 'jobTrackerTestChecklist'

function loadChecklist() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return {}
}

function saveChecklist(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function Proof() {
    const [checked, setChecked] = useState(() => loadChecklist())

    const passedCount = useMemo(
        () => TEST_ITEMS.filter(t => checked[t.id]).length,
        [checked]
    )

    const allPassed = passedCount === TEST_ITEMS.length

    const toggleItem = (id) => {
        setChecked(prev => {
            const next = { ...prev, [id]: !prev[id] }
            saveChecklist(next)
            return next
        })
    }

    const resetAll = () => {
        const empty = {}
        saveChecklist(empty)
        setChecked(empty)
    }

    return (
        <div className="page-shell">
            <div className="page-header">
                <h1 className="page-title">Proof</h1>
                <p className="page-subtitle">Verify every feature works before you ship. No shortcuts.</p>
            </div>
            <div className="page-body">
                {/* Test Result Summary */}
                <div className={`test-summary ${allPassed ? 'test-summary--pass' : ''}`} id="test-summary">
                    <div className="test-summary-score">
                        <span className="test-summary-number">{passedCount}</span>
                        <span className="test-summary-divider">/</span>
                        <span className="test-summary-total">{TEST_ITEMS.length}</span>
                    </div>
                    <div className="test-summary-info">
                        <h3 className="test-summary-title">
                            {allPassed ? 'All tests passed' : 'Tests Passed'}
                        </h3>
                        <p className="test-summary-text">
                            {allPassed
                                ? 'Your application is ready to ship.'
                                : 'Resolve all issues before shipping.'
                            }
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="test-progress-bar">
                    <div
                        className="test-progress-fill"
                        style={{ width: `${(passedCount / TEST_ITEMS.length) * 100}%` }}
                    ></div>
                </div>

                {/* Test Checklist */}
                <div className="test-checklist" id="test-checklist">
                    {TEST_ITEMS.map((item, idx) => (
                        <div
                            className={`test-item ${checked[item.id] ? 'test-item--checked' : ''}`}
                            key={item.id}
                            id={`test-${item.id}`}
                        >
                            <button
                                className="test-item-checkbox"
                                onClick={() => toggleItem(item.id)}
                                aria-label={`Toggle ${item.label}`}
                            >
                                {checked[item.id] ? (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <rect x="1" y="1" width="16" height="16" rx="4" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                                        <path d="M5 9l3 3 5-6" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <rect x="1" y="1" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.2" fill="none" />
                                    </svg>
                                )}
                            </button>
                            <div className="test-item-content">
                                <div className="test-item-row">
                                    <span className="test-item-index">{idx + 1}.</span>
                                    <span className={`test-item-label ${checked[item.id] ? 'test-item-label--done' : ''}`}>
                                        {item.label}
                                    </span>
                                </div>
                                <p className="test-item-hint">{item.hint}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reset button */}
                <div className="test-actions">
                    <button className="btn btn-secondary btn-sm" onClick={resetAll} id="btn-reset-tests">
                        Reset Test Status
                    </button>
                </div>

                {/* Ship Lock */}
                <div className={`ship-card ${allPassed ? 'ship-card--unlocked' : 'ship-card--locked'}`} id="ship-card">
                    {allPassed ? (
                        <>
                            <div className="ship-card-icon ship-card-icon--unlock">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <rect x="8" y="18" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M14 18v-5a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <circle cx="20" cy="27" r="2" fill="currentColor" />
                                </svg>
                            </div>
                            <h3 className="ship-card-title">Ready to Ship</h3>
                            <p className="ship-card-text">
                                All {TEST_ITEMS.length} tests passed. Your Job Notification Tracker is verified and ready for production.
                            </p>
                            <a
                                className="btn btn-primary"
                                href="https://mukeshchettyd.github.io/kodnest-premium-build-system/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Deployed App
                            </a>
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
                                Complete all {TEST_ITEMS.length} tests above to unlock shipping.
                                {passedCount > 0 && ` ${TEST_ITEMS.length - passedCount} remaining.`}
                            </p>
                            <button className="btn btn-primary" disabled>
                                Ship Application
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Proof
