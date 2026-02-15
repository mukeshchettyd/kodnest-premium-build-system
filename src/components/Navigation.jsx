import { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/saved', label: 'Saved' },
    { to: '/digest', label: 'Digest' },
    { to: '/settings', label: 'Settings' },
    { to: '/proof', label: 'Proof' },
    { to: '/rb/01-problem', label: 'AI Resume Builder' },
]

const BUILD_STEP_CHECKS = [
    () => true,  // Design system
    () => true,  // Route skeleton
    () => true,  // Dataset
    () => true,  // Dashboard + filters
    () => { try { return !!localStorage.getItem('jobTrackerPreferences') } catch { return false } },
    () => { try { return Object.keys(localStorage).some(k => k.startsWith('jobTrackerDigest_')) } catch { return false } },
    () => true,  // Status tracking
    () => { try { const c = JSON.parse(localStorage.getItem('jobTrackerTestChecklist') || '{}'); return Object.values(c).filter(Boolean).length === 10 } catch { return false } },
]

function computeShipStatus() {
    try {
        const checklistData = JSON.parse(localStorage.getItem('jobTrackerTestChecklist') || '{}')
        const allTestsPassed = Object.values(checklistData).filter(Boolean).length === 10
        const artifacts = JSON.parse(localStorage.getItem('jobTrackerArtifacts') || '{}')
        const isValidUrl = (s) => { try { const u = new URL(s || ''); return u.protocol === 'http:' || u.protocol === 'https:' } catch { return false } }
        const allLinks = isValidUrl(artifacts.lovable) && isValidUrl(artifacts.github) && isValidUrl(artifacts.deployed)
        if (allTestsPassed && allLinks) return 'Shipped'
        const completedSteps = BUILD_STEP_CHECKS.filter(fn => fn()).length
        if (completedSteps > 0) return 'In Progress'
        return 'Not Started'
    } catch { return 'Not Started' }
}

function Navigation() {
    const [menuOpen, setMenuOpen] = useState(false)

    const completedSteps = useMemo(() => BUILD_STEP_CHECKS.filter(fn => fn()).length, [])
    const shipStatus = useMemo(() => computeShipStatus(), [])

    const shipBadgeClass =
        shipStatus === 'Shipped' ? 'topbar-badge--shipped' :
            shipStatus === 'In Progress' ? 'topbar-badge--progress' :
                'topbar-badge--default'

    const toggleMenu = () => setMenuOpen(prev => !prev)
    const closeMenu = () => setMenuOpen(false)

    return (
        <nav className="nav" id="main-nav">
            <div className="nav-inner">
                <NavLink to="/" className="nav-brand" onClick={closeMenu}>
                    KodNest Premium
                </NavLink>

                {/* Center: Progress Indicator */}
                <div className="topbar-center">
                    <span className="topbar-progress">Step {completedSteps} / {BUILD_STEP_CHECKS.length}</span>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${(completedSteps / BUILD_STEP_CHECKS.length) * 100}%` }}></div>
                    </div>
                </div>

                {/* Right: Status Badge + Hamburger */}
                <div className="topbar-right">
                    <span className={`topbar-badge ${shipBadgeClass}`}>{shipStatus}</span>

                    <button
                        className="nav-hamburger"
                        id="nav-hamburger"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                    >
                        <span className={`nav-hamburger-line ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`nav-hamburger-line ${menuOpen ? 'open' : ''}`}></span>
                        <span className={`nav-hamburger-line ${menuOpen ? 'open' : ''}`}></span>
                    </button>
                </div>

                <ul className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`} id="nav-links">
                    {navItems.map(item => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'nav-link--active' : ''}`
                                }
                                onClick={closeMenu}
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {menuOpen && (
                <div className="nav-overlay" onClick={closeMenu}></div>
            )}
        </nav>
    )
}

export default Navigation
