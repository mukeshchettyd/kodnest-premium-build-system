/**
 * KodNest Premium — Match Score Engine
 *
 * Scoring Rules (deterministic, capped at 100):
 *   +25  if any roleKeyword appears in job.title (case-insensitive)
 *   +15  if any roleKeyword appears in job.description (case-insensitive)
 *   +15  if job.location matches any preferredLocation
 *   +10  if job.mode matches any preferredMode
 *   +10  if job.experience matches experienceLevel
 *   +15  if any job.skill overlaps with user.skills
 *   +5   if postedDaysAgo <= 2
 *   +5   if source is LinkedIn
 */

export function computeMatchScore(job, preferences) {
    if (!preferences) return null

    const {
        roleKeywords = [],
        preferredLocations = [],
        preferredModes = [],
        experienceLevel = '',
        skills = [],
    } = preferences

    let score = 0
    let breakdown = []

    // +25: roleKeyword in title
    if (roleKeywords.length > 0) {
        const titleLower = job.title.toLowerCase()
        const titleMatch = roleKeywords.some(kw => titleLower.includes(kw.toLowerCase()))
        if (titleMatch) {
            score += 25
            breakdown.push({ rule: 'Keyword in title', points: 25 })
        }
    }

    // +15: roleKeyword in description
    if (roleKeywords.length > 0) {
        const descLower = job.description.toLowerCase()
        const descMatch = roleKeywords.some(kw => descLower.includes(kw.toLowerCase()))
        if (descMatch) {
            score += 15
            breakdown.push({ rule: 'Keyword in description', points: 15 })
        }
    }

    // +15: location match
    if (preferredLocations.length > 0) {
        const locMatch = preferredLocations.some(
            loc => loc.toLowerCase() === job.location.toLowerCase()
        )
        if (locMatch) {
            score += 15
            breakdown.push({ rule: 'Location match', points: 15 })
        }
    }

    // +10: mode match
    if (preferredModes.length > 0) {
        const modeMatch = preferredModes.some(
            m => m.toLowerCase() === job.mode.toLowerCase()
        )
        if (modeMatch) {
            score += 10
            breakdown.push({ rule: 'Mode match', points: 10 })
        }
    }

    // +10: experience match
    if (experienceLevel) {
        if (job.experience.toLowerCase() === experienceLevel.toLowerCase()) {
            score += 10
            breakdown.push({ rule: 'Experience match', points: 10 })
        }
    }

    // +15: skills overlap
    if (skills.length > 0) {
        const jobSkillsLower = job.skills.map(s => s.toLowerCase())
        const skillMatch = skills.some(s => jobSkillsLower.includes(s.toLowerCase()))
        if (skillMatch) {
            score += 15
            breakdown.push({ rule: 'Skills overlap', points: 15 })
        }
    }

    // +5: recent post
    if (job.postedDaysAgo <= 2) {
        score += 5
        breakdown.push({ rule: 'Posted recently', points: 5 })
    }

    // +5: LinkedIn source
    if (job.source === 'LinkedIn') {
        score += 5
        breakdown.push({ rule: 'LinkedIn source', points: 5 })
    }

    // Cap at 100
    score = Math.min(score, 100)

    return { score, breakdown }
}

/**
 * Returns the badge tier for a given match score.
 */
export function getScoreTier(score) {
    if (score >= 80) return 'high'
    if (score >= 60) return 'medium'
    if (score >= 40) return 'low'
    return 'minimal'
}

/**
 * Parse comma-separated string into trimmed, non-empty array.
 */
export function parseCommaSeparated(str) {
    if (!str) return []
    return str.split(',').map(s => s.trim()).filter(Boolean)
}

/**
 * Load preferences from localStorage.
 */
export function loadPreferences() {
    try {
        const raw = localStorage.getItem('jobTrackerPreferences')
        if (!raw) return null
        return JSON.parse(raw)
    } catch {
        return null
    }
}

/**
 * Save preferences to localStorage.
 */
export function savePreferences(prefs) {
    localStorage.setItem('jobTrackerPreferences', JSON.stringify(prefs))
}

/**
 * Extract a rough numeric value from salary strings for sorting.
 * e.g. "10–18 LPA" → 10, "₹40k/month" → 4.8 (annualized)
 */
export function extractSalaryNumeric(salaryRange) {
    if (!salaryRange) return 0

    // Match LPA values like "3–5 LPA" or "10–18 LPA"
    const lpaMatch = salaryRange.match(/(\d+)[–-](\d+)\s*LPA/i)
    if (lpaMatch) return parseInt(lpaMatch[1], 10)

    // Match monthly values like "₹40k/month" or "₹15k–₹40k/month"
    const monthMatch = salaryRange.match(/₹(\d+)k/i)
    if (monthMatch) return (parseInt(monthMatch[1], 10) * 12) / 100 // rough LPA

    return 0
}
