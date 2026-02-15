import { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import RB_STEPS from '../data/rbSteps'

/* ================================================================
   STORAGE HELPERS
   ================================================================ */
const RB_ARTIFACT_PREFIX = 'rb_step_'
const RB_ARTIFACT_SUFFIX = '_artifact'
const RB_FEEDBACK_KEY = 'rb_step_feedback'

function getArtifactKey(stepId) {
    return `${RB_ARTIFACT_PREFIX}${stepId}${RB_ARTIFACT_SUFFIX}`
}

function loadArtifact(stepId) {
    try { return localStorage.getItem(getArtifactKey(stepId)) || '' } catch { return '' }
}

function saveArtifact(stepId, value) {
    localStorage.setItem(getArtifactKey(stepId), value)
}

function loadFeedback() {
    try { return JSON.parse(localStorage.getItem(RB_FEEDBACK_KEY) || '{}') } catch { return {} }
}

function saveFeedback(data) {
    localStorage.setItem(RB_FEEDBACK_KEY, JSON.stringify(data))
}

function isStepComplete(stepId) {
    const artifact = loadArtifact(stepId)
    return artifact && artifact.trim().length > 0
}

/* ================================================================
   COMPONENT
   ================================================================ */
function RbStep() {
    const { slug } = useParams()
    const navigate = useNavigate()

    // Find current step
    const step = useMemo(() => RB_STEPS.find(s => s.slug === slug), [slug])
    const stepIndex = useMemo(() => RB_STEPS.findIndex(s => s.slug === slug), [slug])

    // Redirect if invalid step
    useEffect(() => {
        if (!step) navigate('/rb/01-problem', { replace: true })
    }, [step, navigate])

    // Gate: check if all previous steps are completed
    const canAccessStep = useMemo(() => {
        for (let i = 0; i < stepIndex; i++) {
            if (!isStepComplete(RB_STEPS[i].id)) return false
        }
        return true
    }, [stepIndex])

    // Redirect if trying to skip
    useEffect(() => {
        if (step && !canAccessStep) {
            // Find first incomplete step
            for (let i = 0; i < RB_STEPS.length; i++) {
                if (!isStepComplete(RB_STEPS[i].id)) {
                    navigate(`/rb/${RB_STEPS[i].slug}`, { replace: true })
                    return
                }
            }
        }
    }, [step, canAccessStep, navigate])

    // State
    const [artifact, setArtifact] = useState('')
    const [copied, setCopied] = useState(false)
    const [feedback, setFeedback] = useState(() => loadFeedback())
    const [screenshotName, setScreenshotName] = useState('')

    // Load artifact on step change
    useEffect(() => {
        if (step) {
            setArtifact(loadArtifact(step.id))
            setCopied(false)
        }
    }, [step])

    // Completed steps count for topbar
    const completedCount = useMemo(() =>
        RB_STEPS.filter(s => isStepComplete(s.id)).length
        , [artifact])

    // Current step status
    const currentStepDone = artifact && artifact.trim().length > 0

    // Nav helpers
    const prevStep = stepIndex > 0 ? RB_STEPS[stepIndex - 1] : null
    const nextStep = stepIndex < RB_STEPS.length - 1 ? RB_STEPS[stepIndex + 1] : null
    const isLastStep = stepIndex === RB_STEPS.length - 1

    // Ship status
    const shipStatus = useMemo(() => {
        const total = RB_STEPS.filter(s => isStepComplete(s.id)).length
        if (total === RB_STEPS.length) return 'Shipped'
        if (total > 0) return 'In Progress'
        return 'Not Started'
    }, [artifact])

    const shipBadgeClass =
        shipStatus === 'Shipped' ? 'topbar-badge--shipped' :
            shipStatus === 'In Progress' ? 'topbar-badge--progress' :
                'topbar-badge--default'

    // Copy prompt
    const handleCopyPrompt = useCallback(async () => {
        if (!step) return
        try {
            await navigator.clipboard.writeText(step.defaultPrompt)
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
        } catch {
            const ta = document.createElement('textarea')
            ta.value = step.defaultPrompt
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
        }
    }, [step])

    // Save artifact (screenshot URL or text)
    const handleArtifactChange = (e) => {
        const val = e.target.value
        setArtifact(val)
        if (step) saveArtifact(step.id, val)
    }

    // Feedback handlers
    const handleFeedback = (type) => {
        if (!step) return
        const updated = { ...feedback, [step.id]: type }
        setFeedback(updated)
        saveFeedback(updated)
    }

    // Screenshot name
    const handleScreenshotName = (e) => {
        setScreenshotName(e.target.value)
    }

    const handleAddScreenshot = () => {
        if (!step || !screenshotName.trim()) return
        const val = `[Screenshot: ${screenshotName.trim()}]${artifact ? '\n' + artifact : ''}`
        setArtifact(val)
        saveArtifact(step.id, val)
        setScreenshotName('')
    }

    if (!step) return null

    const currentFeedback = feedback[step.id] || null

    return (
        <div className="rb-layout">
            {/* ===================== TOP BAR ===================== */}
            <div className="rb-topbar" id="rb-topbar">
                <div className="rb-topbar-inner">
                    <div className="rb-topbar-left">
                        <Link to="/" className="rb-topbar-brand" id="rb-brand-link">AI Resume Builder</Link>
                    </div>
                    <div className="rb-topbar-center">
                        <span className="rb-topbar-progress">Project 3 — Step {step.id} of {RB_STEPS.length}</span>
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${(completedCount / RB_STEPS.length) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="rb-topbar-right">
                        <span className={`topbar-badge ${shipBadgeClass}`} id="rb-status-badge">{shipStatus}</span>
                    </div>
                </div>
            </div>

            {/* ===================== CONTEXT HEADER ===================== */}
            <div className="rb-context-header" id="rb-context-header">
                <div className="rb-context-inner">
                    <span className="rb-step-eyebrow">Step {step.id} of {RB_STEPS.length}</span>
                    <h1 className="rb-step-title">{step.title}</h1>
                    <p className="rb-step-subtitle">{step.subtitle}</p>
                </div>
            </div>

            {/* ===================== WORKSPACE ===================== */}
            <div className="rb-workspace" id="rb-workspace">
                {/* ---------- Main Workspace 70% ---------- */}
                <div className="rb-main" id="rb-main-workspace">
                    <div className="rb-main-inner">
                        <h2 className="rb-section-title">Objective</h2>
                        <p className="rb-section-desc">{step.description}</p>

                        <div className="rb-divider"></div>

                        <h2 className="rb-section-title">Step Artifact</h2>
                        <p className="rb-section-desc">
                            Paste your completed artifact below (Lovable project link, screenshot description, or output text).
                            The Next button unlocks once an artifact is provided.
                        </p>

                        <div className="rb-artifact-input">
                            <label className="input-label" htmlFor="rb-artifact-textarea">Artifact for Step {step.id}</label>
                            <textarea
                                className="input-field rb-artifact-textarea"
                                id="rb-artifact-textarea"
                                placeholder="Paste your artifact here (link, screenshot, or text output)..."
                                value={artifact}
                                onChange={handleArtifactChange}
                                rows={5}
                            />
                        </div>

                        <div className="rb-screenshot-row">
                            <input
                                className="input-field rb-screenshot-input"
                                id="rb-screenshot-input"
                                type="text"
                                placeholder="Screenshot filename or label..."
                                value={screenshotName}
                                onChange={handleScreenshotName}
                            />
                            <button
                                className="btn btn-secondary btn-sm"
                                id="rb-add-screenshot"
                                onClick={handleAddScreenshot}
                                disabled={!screenshotName.trim()}
                            >
                                Add Screenshot
                            </button>
                        </div>

                        {/* Step navigation */}
                        <div className="rb-step-nav">
                            {prevStep ? (
                                <Link to={`/rb/${prevStep.slug}`} className="btn btn-secondary" id="rb-prev-btn">
                                    ← Previous
                                </Link>
                            ) : <div></div>}

                            {isLastStep ? (
                                <Link
                                    to="/rb/proof"
                                    className={`btn ${currentStepDone ? 'btn-primary' : 'btn-secondary'}`}
                                    id="rb-proof-btn"
                                    style={!currentStepDone ? { pointerEvents: 'none', opacity: 0.4 } : {}}
                                >
                                    View Proof →
                                </Link>
                            ) : (
                                <Link
                                    to={nextStep ? `/rb/${nextStep.slug}` : '#'}
                                    className={`btn ${currentStepDone ? 'btn-primary' : 'btn-secondary'}`}
                                    id="rb-next-btn"
                                    style={!currentStepDone ? { pointerEvents: 'none', opacity: 0.4 } : {}}
                                >
                                    Next Step →
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* ---------- Secondary Build Panel 30% ---------- */}
                <div className="rb-panel" id="rb-build-panel">
                    <div className="rb-panel-inner">
                        {/* Prompt box */}
                        <div className="panel-section">
                            <span className="panel-section-title">{step.promptLabel}</span>
                            <div className="prompt-box" id="rb-prompt-box">
                                <span className="prompt-box-label">Prompt</span>
                                {step.defaultPrompt}
                            </div>
                            <button
                                className={`btn ${copied ? 'btn-success' : 'btn-secondary'} rb-copy-btn`}
                                onClick={handleCopyPrompt}
                                id="rb-copy-prompt"
                            >
                                {copied ? '✓ Copied' : 'Copy Prompt'}
                            </button>
                        </div>

                        {/* Build in Lovable */}
                        <div className="panel-section">
                            <span className="panel-section-title">Build Action</span>
                            <a
                                href="https://lovable.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary rb-lovable-btn"
                                id="rb-build-lovable"
                            >
                                Build in Lovable ↗
                            </a>
                        </div>

                        {/* Feedback */}
                        <div className="panel-section">
                            <span className="panel-section-title">Build Result</span>
                            <div className="rb-feedback-group">
                                <button
                                    className={`btn btn-sm ${currentFeedback === 'worked' ? 'btn-success' : 'btn-secondary'}`}
                                    onClick={() => handleFeedback('worked')}
                                    id="rb-feedback-worked"
                                >
                                    ✓ It Worked
                                </button>
                                <button
                                    className={`btn btn-sm ${currentFeedback === 'error' ? 'btn-warning' : 'btn-secondary'}`}
                                    onClick={() => handleFeedback('error')}
                                    id="rb-feedback-error"
                                >
                                    ✗ Error
                                </button>
                                <button
                                    className={`btn btn-sm ${currentFeedback === 'screenshot' ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => handleFeedback('screenshot')}
                                    id="rb-feedback-screenshot"
                                >
                                    📷 Add Screenshot
                                </button>
                            </div>
                        </div>

                        {/* Step Progress Mini */}
                        <div className="panel-section">
                            <span className="panel-section-title">Progress</span>
                            <div className="rb-mini-steps">
                                {RB_STEPS.map(s => (
                                    <div
                                        key={s.id}
                                        className={`rb-mini-step ${isStepComplete(s.id) ? 'rb-mini-step--done' : ''} ${s.id === step.id ? 'rb-mini-step--active' : ''}`}
                                        title={`Step ${s.id}: ${s.title}`}
                                    >
                                        {s.id}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===================== PROOF FOOTER ===================== */}
            <div className="rb-proof-footer" id="rb-proof-footer">
                <div className="rb-proof-footer-inner">
                    <span className="rb-footer-label">Build Track:</span>
                    {RB_STEPS.map(s => (
                        <Link
                            key={s.id}
                            to={`/rb/${s.slug}`}
                            className={`rb-footer-step ${isStepComplete(s.id) ? 'rb-footer-step--done' : ''} ${s.id === step.id ? 'rb-footer-step--active' : ''}`}
                            title={s.title}
                        >
                            <span className="rb-footer-step-num">{s.id}</span>
                        </Link>
                    ))}
                    <Link to="/rb/proof" className="btn btn-sm btn-secondary rb-footer-proof-btn" id="rb-footer-proof-link">
                        Proof
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RbStep
