function FilterBar({ filters, onFilterChange, jobCount }) {
    const handleChange = (e) => {
        onFilterChange({ ...filters, [e.target.name]: e.target.value })
    }

    return (
        <div className="filter-bar" id="filter-bar">
            <div className="filter-bar-top">
                <div className="filter-search-wrap">
                    <svg className="filter-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <input
                        className="filter-search"
                        id="filter-keyword"
                        type="text"
                        name="keyword"
                        placeholder="Search by title or company..."
                        value={filters.keyword}
                        onChange={handleChange}
                    />
                </div>
                <span className="filter-count">{jobCount} jobs found</span>
            </div>

            <div className="filter-bar-row">
                <select className="filter-select" id="filter-location" name="location" value={filters.location} onChange={handleChange}>
                    <option value="">All Locations</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Noida">Noida</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Mysore">Mysore</option>
                </select>

                <select className="filter-select" id="filter-mode" name="mode" value={filters.mode} onChange={handleChange}>
                    <option value="">All Modes</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                </select>

                <select className="filter-select" id="filter-experience" name="experience" value={filters.experience} onChange={handleChange}>
                    <option value="">All Experience</option>
                    <option value="Fresher">Fresher</option>
                    <option value="0-1">0–1 years</option>
                    <option value="1-3">1–3 years</option>
                    <option value="3-5">3–5 years</option>
                </select>

                <select className="filter-select" id="filter-source" name="source" value={filters.source} onChange={handleChange}>
                    <option value="">All Sources</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Naukri">Naukri</option>
                    <option value="Indeed">Indeed</option>
                </select>

                <select className="filter-select" id="filter-sort" name="sort" value={filters.sort} onChange={handleChange}>
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>
        </div>
    )
}

export default FilterBar
