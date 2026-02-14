import { useState } from 'react'
import jobs from '../data/jobs'
import JobCard from '../components/JobCard'
import JobModal from '../components/JobModal'

function Saved() {
    const [selectedJob, setSelectedJob] = useState(null)
    const [savedIds, setSavedIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('savedJobs')) || []
        } catch {
            return []
        }
    })

    const savedJobs = jobs.filter(j => savedIds.includes(j.id))

    const toggleSave = (id) => {
        setSavedIds(prev => {
            const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            localStorage.setItem('savedJobs', JSON.stringify(next))
            return next
        })
    }

    return (
        <div className="page-shell">
            <div className="page-header">
                <h1 className="page-title">Saved</h1>
                <p className="page-subtitle">
                    Jobs you've bookmarked for later review.
                    {savedJobs.length > 0 && ` ${savedJobs.length} saved.`}
                </p>
            </div>
            <div className="page-body">
                {savedJobs.length > 0 ? (
                    <div className="job-grid">
                        {savedJobs.map(job => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onView={setSelectedJob}
                                onSave={toggleSave}
                                isSaved={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state-card">
                        <div className="empty-state-icon-wrap">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 8h20v32l-10-7-10 7V8z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                <path d="M14 8h20v32l-10-7-10 7V8z" fill="currentColor" opacity="0.06" />
                            </svg>
                        </div>
                        <h3 className="empty-state-title">No saved jobs</h3>
                        <p className="empty-state-text">
                            When you find a job worth revisiting, save it from the Dashboard.
                            Your bookmarked positions will appear here.
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

export default Saved
