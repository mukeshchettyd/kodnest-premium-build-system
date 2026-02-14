import { useState } from 'react'

function Settings() {
    const [form, setForm] = useState({
        keywords: '',
        locations: '',
        mode: '',
        experience: '',
    })

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="page-shell">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Define what you're looking for. We'll handle the rest.</p>
            </div>
            <div className="page-body">
                <div className="settings-form">
                    <div className="form-section">
                        <h3 className="form-section-title">Job Preferences</h3>
                        <p className="form-section-desc">
                            Tell us the roles and conditions that matter to you.
                            These preferences shape your daily digest.
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="input-label" htmlFor="keywords">Role Keywords</label>
                        <input
                            className="input-field"
                            id="keywords"
                            name="keywords"
                            type="text"
                            placeholder="e.g. Frontend Engineer, React Developer, UI Engineer"
                            value={form.keywords}
                            onChange={handleChange}
                        />
                        <span className="input-hint">Separate multiple keywords with commas.</span>
                    </div>

                    <div className="form-group">
                        <label className="input-label" htmlFor="locations">Preferred Locations</label>
                        <input
                            className="input-field"
                            id="locations"
                            name="locations"
                            type="text"
                            placeholder="e.g. Bangalore, Hyderabad, Remote"
                            value={form.locations}
                            onChange={handleChange}
                        />
                        <span className="input-hint">Leave empty to include all locations.</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="input-label" htmlFor="mode">Work Mode</label>
                            <select
                                className="input-field"
                                id="mode"
                                name="mode"
                                value={form.mode}
                                onChange={handleChange}
                            >
                                <option value="">Select mode</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="onsite">Onsite</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="input-label" htmlFor="experience">Experience Level</label>
                            <select
                                className="input-field"
                                id="experience"
                                name="experience"
                                value={form.experience}
                                onChange={handleChange}
                            >
                                <option value="">Select level</option>
                                <option value="entry">Entry Level (0–2 years)</option>
                                <option value="mid">Mid Level (3–5 years)</option>
                                <option value="senior">Senior (6–10 years)</option>
                                <option value="lead">Lead / Staff (10+ years)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="btn btn-primary" id="btn-save-settings" disabled>
                            Save Preferences
                        </button>
                        <span className="form-actions-hint">Logic will be implemented in the next step.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
