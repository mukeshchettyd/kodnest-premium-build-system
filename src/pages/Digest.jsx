function Digest() {
    return (
        <div className="page-shell">
            <div className="page-header">
                <h1 className="page-title">Digest</h1>
                <p className="page-subtitle">Your daily summary of matched positions, delivered at 9AM.</p>
            </div>
            <div className="page-body">
                <div className="empty-state-card">
                    <div className="empty-state-icon-wrap">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="10" y="8" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            <path d="M16 16h16M16 22h12M16 28h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                            <circle cx="36" cy="12" r="5" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <h3 className="empty-state-title">No digest available</h3>
                    <p className="empty-state-text">
                        Once your preferences are set and jobs are loaded,
                        your curated daily digest will appear here — clean,
                        organized, and ready to act on.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Digest
