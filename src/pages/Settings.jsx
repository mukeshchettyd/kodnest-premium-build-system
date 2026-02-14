import { useState, useEffect } from 'react'
import { loadPreferences, savePreferences, parseCommaSeparated } from '../utils/matchEngine'

const ALL_LOCATIONS = [
    'Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Pune',
    'Noida', 'Delhi', 'Gurugram', 'Mysore'
]

const ALL_MODES = ['Remote', 'Hybrid', 'Onsite']

function Settings() {
    const [saved, setSaved] = useState(false)
    const [form, setForm] = useState({
        roleKeywordsRaw: '',
        preferredLocations: [],
        preferredModes: [],
        experienceLevel: '',
        skillsRaw: '',
        minMatchScore: 40,
    })

    useEffect(() => {
        const prefs = loadPreferences()
        if (prefs) {
            setForm({
                roleKeywordsRaw: (prefs.roleKeywords || []).join(', '),
                preferredLocations: prefs.preferredLocations || [],
                preferredModes: prefs.preferredModes || [],
                experienceLevel: prefs.experienceLevel || '',
                skillsRaw: (prefs.skills || []).join(', '),
                minMatchScore: prefs.minMatchScore ?? 40,
            })
        }
    }, [])

    const handleTextChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setSaved(false)
    }

    const handleSliderChange = (e) => {
        setForm(prev => ({ ...prev, minMatchScore: parseInt(e.target.value, 10) }))
        setSaved(false)
    }

    const toggleLocation = (loc) => {
        setForm(prev => ({
            ...prev,
            preferredLocations: prev.preferredLocations.includes(loc)
                ? prev.preferredLocations.filter(l => l !== loc)
                : [...prev.preferredLocations, loc]
        }))
        setSaved(false)
    }

    const toggleMode = (mode) => {
        setForm(prev => ({
            ...prev,
            preferredModes: prev.preferredModes.includes(mode)
                ? prev.preferredModes.filter(m => m !== mode)
                : [...prev.preferredModes, mode]
        }))
        setSaved(false)
    }

    const handleSave = () => {
        const prefs = {
            roleKeywords: parseCommaSeparated(form.roleKeywordsRaw),
            preferredLocations: form.preferredLocations,
            preferredModes: form.preferredModes,
            experienceLevel: form.experienceLevel,
            skills: parseCommaSeparated(form.skillsRaw),
            minMatchScore: form.minMatchScore,
        }
        savePreferences(prefs)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="page-shell">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Define what you're looking for. We'll score every job against your preferences.</p>
            </div>
            <div className="page-body">
                <div className="settings-form">
                    <div className="form-section">
                        <h3 className="form-section-title">Job Preferences</h3>
                        <p className="form-section-desc">
                            These preferences power the match scoring engine.
                            Jobs are scored 0–100 based on how well they align.
                        </p>
                    </div>

                    {/* Role Keywords */}
                    <div className="form-group">
                        <label className="input-label" htmlFor="roleKeywords">Role Keywords</label>
                        <input
                            className="input-field"
                            id="roleKeywords"
                            name="roleKeywordsRaw"
                            type="text"
                            placeholder="e.g. Frontend, React Developer, SDE Intern"
                            value={form.roleKeywordsRaw}
                            onChange={handleTextChange}
                        />
                        <span className="input-hint">Comma-separated. Matched against job titles and descriptions.</span>
                    </div>

                    {/* Preferred Locations */}
                    <div className="form-group">
                        <label className="input-label">Preferred Locations</label>
                        <div className="chip-grid">
                            {ALL_LOCATIONS.map(loc => (
                                <button
                                    key={loc}
                                    type="button"
                                    className={`chip ${form.preferredLocations.includes(loc) ? 'chip--active' : ''}`}
                                    onClick={() => toggleLocation(loc)}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                        <span className="input-hint">Select one or more. Leave empty to include all.</span>
                    </div>

                    {/* Work Mode */}
                    <div className="form-group">
                        <label className="input-label">Work Mode</label>
                        <div className="checkbox-group">
                            {ALL_MODES.map(mode => (
                                <label key={mode} className="checkbox-label" htmlFor={`mode-${mode}`}>
                                    <input
                                        type="checkbox"
                                        id={`mode-${mode}`}
                                        checked={form.preferredModes.includes(mode)}
                                        onChange={() => toggleMode(mode)}
                                        className="checkbox-input"
                                    />
                                    <span className="checkbox-custom"></span>
                                    {mode}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Experience Level */}
                    <div className="form-group">
                        <label className="input-label" htmlFor="experienceLevel">Experience Level</label>
                        <select
                            className="input-field"
                            id="experienceLevel"
                            name="experienceLevel"
                            value={form.experienceLevel}
                            onChange={handleTextChange}
                        >
                            <option value="">Any level</option>
                            <option value="Fresher">Fresher</option>
                            <option value="0-1">0–1 years</option>
                            <option value="1-3">1–3 years</option>
                            <option value="3-5">3–5 years</option>
                        </select>
                    </div>

                    {/* Skills */}
                    <div className="form-group">
                        <label className="input-label" htmlFor="skills">Your Skills</label>
                        <input
                            className="input-field"
                            id="skills"
                            name="skillsRaw"
                            type="text"
                            placeholder="e.g. React, JavaScript, Python, SQL"
                            value={form.skillsRaw}
                            onChange={handleTextChange}
                        />
                        <span className="input-hint">Comma-separated. Matched against required skills in job listings.</span>
                    </div>

                    {/* Min Match Score Slider */}
                    <div className="form-group">
                        <label className="input-label" htmlFor="minMatchScore">
                            Minimum Match Threshold: <strong>{form.minMatchScore}%</strong>
                        </label>
                        <div className="slider-wrap">
                            <input
                                type="range"
                                id="minMatchScore"
                                className="slider-input"
                                min="0"
                                max="100"
                                step="5"
                                value={form.minMatchScore}
                                onChange={handleSliderChange}
                            />
                            <div className="slider-labels">
                                <span>0</span>
                                <span>25</span>
                                <span>50</span>
                                <span>75</span>
                                <span>100</span>
                            </div>
                        </div>
                        <span className="input-hint">Jobs below this score are hidden when "Show only matches" is enabled on the dashboard.</span>
                    </div>

                    {/* Save */}
                    <div className="form-actions">
                        <button className="btn btn-primary" id="btn-save-settings" onClick={handleSave}>
                            {saved ? '✓ Preferences Saved' : 'Save Preferences'}
                        </button>
                        {saved && (
                            <span className="form-actions-hint form-actions-success">
                                Preferences saved. Go to Dashboard to see scored results.
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
