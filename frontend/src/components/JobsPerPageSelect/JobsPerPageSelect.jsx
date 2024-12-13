import React from 'react';

function JobsPerPageSelect({ jobsPerPage, setJobsPerPage }) {
    const options = [10, 30, 50, 100];

    const handleChange = (event) => {
        setJobsPerPage(Number(event.target.value));
    };

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="jobs-per-page" className="text-sm font-medium text-neutral-900">
                Jobs per page:
            </label>
            <select
                id="jobs-per-page"
                value={jobsPerPage}
                onChange={handleChange}
                className="border rounded px-4 py-2 text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-600"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default JobsPerPageSelect;
