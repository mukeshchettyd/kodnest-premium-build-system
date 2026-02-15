import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import RB_STEPS from '../data/rbSteps'

/* ================================================================
   STORAGE HELPERS
   ================================================================ */
const RB_ARTIFACT_PREFIX = 'rb_step_'
const RB_ARTIFACT_SUFFIX = '_artifact'
const RB_PROOF_LINKS_KEY = 'rb_proof_links'

function getArtifactKey(stepId) {
    return `${RB_ARTIFACT_PREFIX}${stepId}${RB_ARTIFACT_SUFFIX}`
}

function isStepComplete(stepId) {
    try {
        const artifact = localStorage.getItem(getArtifactKey(stepId)) || ''
        return artifact.trim().length > 0
    } catch { return false }
}

function loadProofLinks() {
    try { return JSON.parse(localStorage.getItem(RB_PROOF_LINKS_KEY) || '{}') } catch { return {} }
}

function saveProofLinks(data) {
    localStorage.setItem(RB_PROOF_LINKS_KEY, JSON.stringify(data))
}

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
function RbProof() {
    const [links, setLinks] = useState(() => loadProofLinks())
    const [copied, setCopied] = useState(false)
    const [urlErrors, setUrlErrors] = useState({})

    // Step statuses
    const stepStatuses = useMemo(() =>
        RB_STEPS.map(s => ({
            ...s,
            completed: isStepComplete(s.id)
        }))
        , [])

    const completedSteps = stepStatuses.filter(s => s.completed).length

    // Link validation
    const lovableValid = isValidUrl(links.lovable)
    const githubValid = isValidUrl(links.github)
    const deployedValid = isValidUrl(links.deployed)
    const allLinksProvided = lovableValid && githubValid && deployedValid
    const allStepsComplete = completedSteps === RB_STEPS.length

    // Ship status
    const shipStatus = useMemo(() => {
        if (allStepsComplete && allLinksProvided) return 'Shipped'
        if (completedSteps > 0) return 'In Progress'
        return 'Not Started'
    }, [allStepsComplete, allLinksProvided, completedSteps])

    const shipBadgeClass =
        shipStatus === 'Shipped' ? 'ship-status--shipped' :
            shipStatus === 'In Progress' ? 'ship-status--progress' :
                'ship-status--notstarted'

    // Link handlers
    const handleLinkChange = (key, value) => {
        setLinks(prev => { const n = { ...prev, [key]: value }; saveProofLinks(n); return n })
        setUrlErrors(prev => ({ ...prev, [key]: false }))
    }

    const validateLink = (key) => {
        if (links[key] && !isValidUrl(links[key])) {
            setUrlErrors(prev => ({ ...prev, [key]: true }))
        }
    }

    // Copy final submission
    const handleCopy = useCallback(async () => {
        const text = `──────────────────────────────────────────
AI Resume Builder — Final Submission
Project 3 — Build Track
──────────────────────────────────────────

Lovable Project:
${links.lovable || '(not provided)'}

GitHub Repository:
${links.github || '(not provided)'}

Live Deployment:
${links.deployed || '(not provided)'}

Build Steps Completed: ${completedSteps} / ${RB_STEPS.length}
${stepStatuses.map((s, i) => `  ${i + 1}. ${s.title} — ${s.completed ? '✓ Done' : '○ Pending'}`).join('\n')}

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
    }, [links, completedSteps, stepStatuses, shipStatus])

    return (
        <div className="rb-layout">
            {/* ===================== TOP BAR ===================== */}
            <div className="rb-topbar" id="rb-proof-topbar">
                <div className="rb-topbar-inner">
                    <div className="rb-topbar-left">
                        <Link to="/" className="rb-topbar-brand">AI Resume Builder</Link>
                    </div>
                    <div className="rb-topbar-center">
                        <span className="rb-topbar-progress">Project 3 — Proof</span>
                    </div>
                    <div className="rb-topbar-right">
                        <span className={`topbar-badge ${shipBadgeClass === 'ship-status--shipped' ? 'topbar-badge--shipped' : shipBadgeClass === 'ship-status--progress' ? 'topbar-badge--progress' : 'topbar-badge--default'}`} id="rb-proof-status-badge">
                            {shipStatus}
                        </span>
                    </div>
                </div>
            </div>

            {/* ===================== CONTEXT HEADER ===================== */}
            <div className="rb-context-header" id="rb-proof-context">
                <div className="rb-context-inner">
                    <span className="rb-step-eyebrow">Final Submission</span>
                    <h1 className="rb-step-title">Proof</h1>
                    <p className="rb-step-subtitle">Review all 8 steps, provide artifact links, and submit your project.</p>
                </div>
            </div>

            {/* ===================== PROOF BODY ===================== */}
            <div className="page-shell rb-proof-body" id="rb-proof-body">
                <div className="page-body">

                    {/* SECTION A: 8 Step Status */}
                    <div className="proof-section">
                        <div className="page-header-row">
                            <div>
                                <h2 className="proof-section-title">Step Completion Summary</h2>
                                <p className="proof-section-desc">{completedSteps} of {RB_STEPS.length} steps completed.</p>
                            </div>
                            <span className={`ship-status-badge ${shipBadgeClass}`}>{shipStatus}</span>
                        </div>

                        <div className="test-progress-bar">
                            <div className="test-progress-fill" style={{ width: `${(completedSteps / RB_STEPS.length) * 100}%` }}></div>
                        </div>

                        <div className="step-list">
                            {stepStatuses.map((step, idx) => (
                                <div className={`step-item ${step.completed ? 'step-item--done' : ''}`} key={step.id}>
                                    <span className="step-item-num">{idx + 1}</span>
                                    <span className="step-item-label">{step.title}</span>
                                    <Link
                                        to={`/rb/${step.slug}`}
                                        className="btn btn-sm btn-secondary"
                                        style={{ marginLeft: 'auto', marginRight: '12px' }}
                                    >
                                        {step.completed ? 'Review' : 'Start'}
                                    </Link>
                                    <span className={`step-item-badge ${step.completed ? 'step-badge--done' : 'step-badge--pending'}`}>
                                        {step.completed ? 'Completed' : 'Pending'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION B: Artifact Links */}
                    <div className="proof-section">
                        <h2 className="proof-section-title">Artifact Collection</h2>
                        <p className="proof-section-desc">Provide all three links to finalize your submission.</p>

                        <div className="artifact-form">
                            <div className="artifact-group">
                                <label className="input-label" htmlFor="rb-artifact-lovable">Lovable Project Link</label>
                                <input
                                    className={`input-field ${urlErrors.lovable ? 'input-field--error' : ''} ${lovableValid ? 'input-field--valid' : ''}`}
                                    id="rb-artifact-lovable"
                                    type="url"
                                    placeholder="https://lovable.dev/projects/..."
                                    value={links.lovable || ''}
                                    onChange={e => handleLinkChange('lovable', e.target.value)}
                                    onBlur={() => validateLink('lovable')}
                                />
                                {urlErrors.lovable && <span className="input-error">Please enter a valid URL.</span>}
                            </div>

                            <div className="artifact-group">
                                <label className="input-label" htmlFor="rb-artifact-github">GitHub Repository Link</label>
                                <input
                                    className={`input-field ${urlErrors.github ? 'input-field--error' : ''} ${githubValid ? 'input-field--valid' : ''}`}
                                    id="rb-artifact-github"
                                    type="url"
                                    placeholder="https://github.com/username/ai-resume-builder"
                                    value={links.github || ''}
                                    onChange={e => handleLinkChange('github', e.target.value)}
                                    onBlur={() => validateLink('github')}
                                />
                                {urlErrors.github && <span className="input-error">Please enter a valid URL.</span>}
                            </div>

                            <div className="artifact-group">
                                <label className="input-label" htmlFor="rb-artifact-deployed">Deployed URL</label>
                                <input
                                    className={`input-field ${urlErrors.deployed ? 'input-field--error' : ''} ${deployedValid ? 'input-field--valid' : ''}`}
                                    id="rb-artifact-deployed"
                                    type="url"
                                    placeholder="https://ai-resume-builder.vercel.app"
                                    value={links.deployed || ''}
                                    onChange={e => handleLinkChange('deployed', e.target.value)}
                                    onBlur={() => validateLink('deployed')}
                                />
                                {urlErrors.deployed && <span className="input-error">Please enter a valid URL.</span>}
                            </div>
                        </div>
                    </div>

                    {/* SECTION C: Final Submission */}
                    <div className="proof-section">
                        <h2 className="proof-section-title">Final Submission</h2>

                        <div className="submission-reqs">
                            <div className={`submission-req ${allLinksProvided ? 'submission-req--met' : ''}`}>
                                {allLinksProvided ? (
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.1" /><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" /></svg>
                                )}
                                <span>All 3 artifact links provided</span>
                            </div>
                            <div className={`submission-req ${allStepsComplete ? 'submission-req--met' : ''}`}>
                                {allStepsComplete ? (
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.1" /><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" /></svg>
                                )}
                                <span>All 8 build steps completed</span>
                            </div>
                        </div>

                        <div className="submission-actions">
                            <button
                                className={`btn ${shipStatus === 'Shipped' ? 'btn-primary' : 'btn-secondary'} ${copied ? 'btn-success' : ''}`}
                                onClick={handleCopy}
                                id="rb-copy-submission"
                            >
                                {copied ? '✓ Copied to Clipboard' : 'Copy Final Submission'}
                            </button>
                        </div>
                    </div>

                    {/* SHIP CARD */}
                    <div className={`ship-card ${shipStatus === 'Shipped' ? 'ship-card--unlocked' : 'ship-card--locked'}`} id="rb-ship-card">
                        {shipStatus === 'Shipped' ? (
                            <>
                                <div className="ship-card-icon ship-card-icon--unlock">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                        <rect x="8" y="18" width="24" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M14 18v-5a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <circle cx="20" cy="27" r="2" fill="currentColor" />
                                    </svg>
                                </div>
                                <h3 className="ship-card-title">Project 3 Shipped Successfully.</h3>
                                <p className="ship-card-text">
                                    All build steps verified. All artifacts collected. Your AI Resume Builder is complete.
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
                                    {!allLinksProvided && !allStepsComplete && 'Provide all 3 artifact links and complete all 8 build steps to ship.'}
                                    {!allLinksProvided && allStepsComplete && 'Provide all 3 artifact links to ship.'}
                                    {allLinksProvided && !allStepsComplete && `Complete all build steps to ship. ${RB_STEPS.length - completedSteps} remaining.`}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Back to Build Track */}
                    <div className="rb-proof-back">
                        <Link to="/rb/01-problem" className="btn btn-secondary" id="rb-proof-back-btn">
                            ← Back to Build Track
                        </Link>
                    </div>
                </div>
            </div>

            {/* ===================== PROOF FOOTER ===================== */}
            <div className="rb-proof-footer" id="rb-proof-page-footer">
                <div className="rb-proof-footer-inner">
                    <span className="rb-footer-label">Build Track:</span>
                    {RB_STEPS.map(s => (
                        <Link
                            key={s.id}
                            to={`/rb/${s.slug}`}
                            className={`rb-footer-step ${isStepComplete(s.id) ? 'rb-footer-step--done' : ''}`}
                            title={s.title}
                        >
                            <span className="rb-footer-step-num">{s.id}</span>
                        </Link>
                    ))}
                    <span className="rb-footer-active-label">Proof</span>
                </div>
            </div>
        </div>
    )
}

export default RbProof
