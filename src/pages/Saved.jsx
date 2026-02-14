function Saved() {
    return (
        <div className="page-shell">
            <div className="page-header">
                <h1 className="page-title">Saved</h1>
                <p className="page-subtitle">Jobs you've bookmarked for later review.</p>
            </div>
            <div className="page-body">
                <div className="empty-state-card">
                    <div className="empty-state-icon-wrap">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 8h20v32l-10-7-10 7V8z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <path d="M14 8h20v32l-10-7-10 7V8z" fill="currentColor" opacity="0.06" />
                        </svg>
                    </div>
                    <h3 className="empty-state-title">No saved jobs</h3>
                    <p className="empty-state-text">
                        When you find a job worth revisiting, save it here.
                        Your bookmarked positions will be listed in a clean,
                        scannable format.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Saved
