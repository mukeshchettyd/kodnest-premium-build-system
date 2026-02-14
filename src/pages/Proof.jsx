function Proof() {
    const checklistItems = [
        { id: 'ui', label: 'UI Built', description: 'All pages render with correct layout and styling.' },
        { id: 'logic', label: 'Logic Working', description: 'Core functionality operates as expected.' },
        { id: 'test', label: 'Test Passed', description: 'Key flows verified manually or via automated tests.' },
        { id: 'deployed', label: 'Deployed', description: 'Live URL accessible and functional.' },
    ]

    return (
        <div className="page-shell">
            <div className="page-header">
                <h1 className="page-title">Proof</h1>
                <p className="page-subtitle">Track build progress and collect evidence of completion.</p>
            </div>
            <div className="page-body">
                <div className="proof-section">
                    <h3 className="form-section-title">Build Checklist</h3>
                    <p className="form-section-desc">
                        Each milestone requires verification before marking complete.
                        Proof artifacts will be collected in a future step.
                    </p>

                    <div className="proof-checklist">
                        {checklistItems.map(item => (
                            <div className="proof-checklist-item" key={item.id} id={`proof-${item.id}`}>
                                <div className="proof-checklist-checkbox">
                                    <div className="proof-checklist-box"></div>
                                </div>
                                <div className="proof-checklist-content">
                                    <div className="proof-checklist-label">{item.label}</div>
                                    <div className="proof-checklist-desc">{item.description}</div>
                                </div>
                                <div className="proof-checklist-status">
                                    <span className="badge badge-neutral">Pending</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="proof-section">
                    <h3 className="form-section-title">Artifacts</h3>
                    <p className="form-section-desc">
                        Screenshots, recordings, and test results will be uploaded here.
                    </p>
                    <div className="empty-state-card empty-state-card--compact">
                        <div className="empty-state-icon-wrap">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="6" y="10" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                <path d="M20 17v6M17 20h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h3 className="empty-state-title">No artifacts yet</h3>
                        <p className="empty-state-text">
                            Artifact upload will be enabled in a future build step.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Proof
