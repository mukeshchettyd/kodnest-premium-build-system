function Dashboard() {
    return (
        <div className="page-shell">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Your matched jobs appear here, refreshed daily.</p>
            </div>
            <div className="page-body">
                <div className="empty-state-card">
                    <div className="empty-state-icon-wrap">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="12" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <path d="M8 18h32" stroke="currentColor" strokeWidth="1.5" />
                            <rect x="12" y="22" width="10" height="3" rx="1" fill="currentColor" opacity="0.2" />
                            <rect x="12" y="28" width="16" height="3" rx="1" fill="currentColor" opacity="0.2" />
                        </svg>
                    </div>
                    <h3 className="empty-state-title">No jobs yet</h3>
                    <p className="empty-state-text">
                        In the next step, you will load a realistic dataset.
                        Matched positions will appear here as clean, scannable cards.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
