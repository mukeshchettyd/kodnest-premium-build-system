import { useState, useMemo } from 'react'
import jobs from '../data/jobs'
import JobCard from '../components/JobCard'
import JobModal from '../components/JobModal'
import FilterBar from '../components/FilterBar'

function Dashboard() {
    const [selectedJob, setSelectedJob] = useState(null)
    const [savedIds, setSavedIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('savedJobs')) || []
        } catch {
            return []
        }
    })

    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        mode: '',
        experience: '',
        source: '',
        sort: 'latest',
    })

    const toggleSave = (id) => {
        setSavedIds(prev => {
            const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            localStorage.setItem('savedJobs', JSON.stringify(next))
            return next
        })
    }

    const filteredJobs = useMemo(() => {
        let result = [...jobs]

        if (filters.keyword) {
            const kw = filters.keyword.toLowerCase()
            result = result.filter(j =>
                j.title.toLowerCase().includes(kw) ||
                j.company.toLowerCase().includes(kw)
            )
        }

        if (filters.location) {
            result = result.filter(j => j.location === filters.location)
        }

        if (filters.mode) {
            result = result.filter(j => j.mode === filters.mode)
        }

        if (filters.experience) {
            result = result.filter(j => j.experience === filters.experience)
        }

        if (filters.source) {
            result = result.filter(j => j.source === filters.source)
        }

        if (filters.sort === 'latest') {
            result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo)
        } else {
            result.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo)
        }

        return result
    }, [filters])

    return (
        <div className="page-shell">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Your matched jobs appear here, refreshed daily.</p>
            </div>
            <div className="page-body">
                <FilterBar
                    filters={filters}
                    onFilterChange={setFilters}
                    jobCount={filteredJobs.length}
                />

                <div className="job-grid">
                    {filteredJobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onView={setSelectedJob}
                            onSave={toggleSave}
                            isSaved={savedIds.includes(job.id)}
                        />
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <div className="empty-state-card">
                        <div className="empty-state-icon-wrap">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <circle cx="24" cy="20" r="10" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M31 27l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <h3 className="empty-state-title">No matching jobs</h3>
                        <p className="empty-state-text">
                            Try adjusting your filters or broadening your search criteria.
                        </p>
                    </div>
                )}
            </div>

            {selectedJob && (
                <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
            )}
        </div>
    )
}

export default Dashboard
