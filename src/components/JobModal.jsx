function JobModal({ job, onClose }) {
    if (!job) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} id="job-modal">
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{job.title}</h2>
                        <span className="modal-company">{job.company} · {job.location}</span>
                    </div>
                    <button className="btn-icon" onClick={onClose} aria-label="Close modal">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="modal-meta-row">
                        <div className="modal-meta-tag">{job.mode}</div>
                        <div className="modal-meta-tag">{job.experience}</div>
                        <div className="modal-meta-tag">{job.salaryRange}</div>
                        <div className="modal-meta-tag">{job.source}</div>
                    </div>

                    <div className="modal-section">
                        <h4 className="modal-section-title">Description</h4>
                        <p className="modal-description">{job.description}</p>
                    </div>

                    <div className="modal-section">
                        <h4 className="modal-section-title">Skills Required</h4>
                        <div className="modal-skills">
                            {job.skills.map(skill => (
                                <span className="skill-tag" key={skill}>{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <a
                        className="btn btn-primary"
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Apply Now
                    </a>
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default JobModal
