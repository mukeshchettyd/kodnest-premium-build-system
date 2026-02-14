import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="landing">
            <div className="landing-content">
                <span className="landing-eyebrow">Job Notification Tracker</span>
                <h1 className="landing-headline">Stop Missing<br />The Right Jobs.</h1>
                <p className="landing-subtext">
                    Precision-matched job discovery delivered daily at 9AM.
                    No noise. No spam. Just the roles that fit.
                </p>
                <Link to="/settings" className="btn btn-primary landing-cta" id="cta-start-tracking">
                    Start Tracking
                </Link>
                <div className="landing-proof">
                    <div className="landing-proof-item">
                        <span className="landing-proof-number">3</span>
                        <span className="landing-proof-label">Keywords tracked</span>
                    </div>
                    <div className="landing-proof-divider"></div>
                    <div className="landing-proof-item">
                        <span className="landing-proof-number">9AM</span>
                        <span className="landing-proof-label">Daily delivery</span>
                    </div>
                    <div className="landing-proof-divider"></div>
                    <div className="landing-proof-item">
                        <span className="landing-proof-number">0</span>
                        <span className="landing-proof-label">Missed opportunities</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
