import { useState } from 'react'
import './styles/global.css'
import './styles/components.css'

function App() {
  const [proofState, setProofState] = useState({
    uiBuilt: false,
    logicWorking: false,
    testPassed: false,
    deployed: false,
  })

  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [statusBadge] = useState('In Progress')

  const currentStep = 2
  const totalSteps = 5
  const progressPercent = (currentStep / totalSteps) * 100

  const prompt = `Create a responsive dashboard page with a sidebar navigation, a metrics overview section showing 4 KPI cards, and a data table with sorting and pagination.`

  const toggleProof = (key) => {
    setProofState(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2000)
    })
  }

  const badgeClass = statusBadge === 'Not Started'
    ? 'badge-neutral'
    : statusBadge === 'In Progress'
      ? 'badge-warning'
      : 'badge-success'

  return (
    <div className="app-shell">
      {/* ---- TOP BAR ---- */}
      <header className="topbar" id="topbar">
        <div className="topbar-left">
          <span className="topbar-project">KodNest Premium</span>
        </div>
        <div className="topbar-center">
          <span className="topbar-progress">Step {currentStep} / {totalSteps}</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        <div className="topbar-right">
          <span className={`badge ${badgeClass}`} id="status-badge">{statusBadge}</span>
        </div>
      </header>

      {/* ---- CONTEXT HEADER ---- */}
      <section className="context-header" id="context-header">
        <h1>Build the Dashboard Interface</h1>
        <p>
          Define your application's primary workspace. This step produces the core layout
          that users interact with daily.
        </p>
      </section>

      {/* ---- WORKSPACE ---- */}
      <section className="workspace-container" id="workspace">
        {/* PRIMARY WORKSPACE (70%) */}
        <main className="primary-workspace" id="primary-workspace">
          {/* Component Showcase */}
          <div style={{ marginBottom: 'var(--space-40)' }}>
            <h3 style={{ marginBottom: 'var(--space-24)' }}>Components</h3>

            {/* Buttons */}
            <div className="card" style={{ marginBottom: 'var(--space-24)' }}>
              <div className="card-header">
                <h4 className="card-title">Buttons</h4>
                <p className="card-subtitle">Primary and secondary actions</p>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-12)', alignItems: 'center' }}>
                  <button className="btn btn-primary" id="btn-primary">Primary Action</button>
                  <button className="btn btn-secondary" id="btn-secondary">Secondary</button>
                  <button className="btn btn-sm btn-primary" id="btn-sm-primary">Small Primary</button>
                  <button className="btn btn-sm btn-secondary" id="btn-sm-secondary">Small Secondary</button>
                  <button className="btn btn-success btn-sm" id="btn-success">Confirmed</button>
                  <button className="btn btn-warning btn-sm" id="btn-warning">Review</button>
                  <button className="btn btn-primary" disabled id="btn-disabled">Disabled</button>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="card" style={{ marginBottom: 'var(--space-24)' }}>
              <div className="card-header">
                <h4 className="card-title">Form Inputs</h4>
                <p className="card-subtitle">Text fields and text areas</p>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-24)' }}>
                  <div>
                    <label className="input-label" htmlFor="input-default">Project Name</label>
                    <input
                      className="input-field"
                      id="input-default"
                      type="text"
                      placeholder="Enter project name"
                    />
                    <span className="input-hint">Choose something short and memorable.</span>
                  </div>
                  <div>
                    <label className="input-label" htmlFor="input-error">API Endpoint</label>
                    <input
                      className="input-field input-error"
                      id="input-error"
                      type="text"
                      value="htp://invalid-url"
                      readOnly
                    />
                    <span className="input-error-message">
                      URL format is incorrect. Try starting with https://.
                    </span>
                  </div>
                </div>
                <div style={{ marginTop: 'var(--space-24)' }}>
                  <label className="input-label" htmlFor="textarea-default">Description</label>
                  <textarea
                    className="input-field"
                    id="textarea-default"
                    placeholder="Describe what your application does..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="card" style={{ marginBottom: 'var(--space-24)' }}>
              <div className="card-header">
                <h4 className="card-title">Badges</h4>
                <p className="card-subtitle">Status and category indicators</p>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
                  <span className="badge badge-neutral">Not Started</span>
                  <span className="badge badge-warning">In Progress</span>
                  <span className="badge badge-accent">Blocked</span>
                  <span className="badge badge-success">Shipped</span>
                </div>
              </div>
            </div>

            {/* Error State */}
            <div className="error-state" style={{ marginBottom: 'var(--space-24)' }}>
              <div className="error-state-title">Build failed</div>
              <div className="error-state-message">
                The deployment pipeline couldn't complete because the environment
                variable <code>DATABASE_URL</code> is missing from your configuration.
              </div>
              <div className="error-state-action">
                <strong>Fix:</strong> Add <code>DATABASE_URL</code> to your <code>.env</code> file
                and re-run the build.
              </div>
            </div>

            {/* Empty State */}
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">◇</div>
                <div className="empty-state-title">No builds yet</div>
                <p className="empty-state-text">
                  Start your first build to see results here. Each build produces a complete,
                  deployable artifact.
                </p>
                <button className="btn btn-primary" id="btn-start-build">Start First Build</button>
              </div>
            </div>
          </div>
        </main>

        {/* SECONDARY PANEL (30%) */}
        <aside className="secondary-panel" id="secondary-panel">
          <div className="panel-section">
            <div className="panel-section-title">Current Step</div>
            <p className="panel-text">
              Build the main dashboard layout. This includes the navigation sidebar,
              metric cards, and the primary data table. Focus on structure first,
              then refine the styling.
            </p>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">Prompt</div>
            <div className="prompt-box" id="prompt-box">
              <span className="prompt-box-label">Copyable Prompt</span>
              {prompt}
            </div>
            <div className="panel-actions">
              <button className="btn btn-secondary btn-sm" id="btn-copy" onClick={handleCopyPrompt}>
                {copiedPrompt ? '✓ Copied' : 'Copy Prompt'}
              </button>
              <button className="btn btn-primary btn-sm" id="btn-build">Build in Lovable</button>
            </div>
          </div>

          <hr className="divider" />

          <div className="panel-section">
            <div className="panel-section-title">Verification</div>
            <div className="panel-actions">
              <button className="btn btn-success btn-sm" id="btn-it-worked">✓ It Worked</button>
              <button className="btn btn-warning btn-sm" id="btn-error">Report Error</button>
              <button className="btn btn-secondary btn-sm" id="btn-screenshot">Add Screenshot</button>
            </div>
          </div>
        </aside>
      </section>

      {/* ---- PROOF FOOTER ---- */}
      <footer className="proof-footer" id="proof-footer">
        <div className="proof-footer-inner">
          <div
            className={`proof-item ${proofState.uiBuilt ? 'checked' : ''}`}
            onClick={() => toggleProof('uiBuilt')}
            id="proof-ui"
          >
            <div className="proof-checkbox">
              {proofState.uiBuilt && <span className="proof-checkmark">✓</span>}
            </div>
            <span>UI Built</span>
          </div>
          <div
            className={`proof-item ${proofState.logicWorking ? 'checked' : ''}`}
            onClick={() => toggleProof('logicWorking')}
            id="proof-logic"
          >
            <div className="proof-checkbox">
              {proofState.logicWorking && <span className="proof-checkmark">✓</span>}
            </div>
            <span>Logic Working</span>
          </div>
          <div
            className={`proof-item ${proofState.testPassed ? 'checked' : ''}`}
            onClick={() => toggleProof('testPassed')}
            id="proof-test"
          >
            <div className="proof-checkbox">
              {proofState.testPassed && <span className="proof-checkmark">✓</span>}
            </div>
            <span>Test Passed</span>
          </div>
          <div
            className={`proof-item ${proofState.deployed ? 'checked' : ''}`}
            onClick={() => toggleProof('deployed')}
            id="proof-deploy"
          >
            <div className="proof-checkbox">
              {proofState.deployed && <span className="proof-checkmark">✓</span>}
            </div>
            <span>Deployed</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
