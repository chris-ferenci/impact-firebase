import React, { useState, useEffect } from "react";

function JobSummary({ jobDescription }) {
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (jobDescription) {
            // Check if a summary is already saved in localStorage
            const cachedSummary = localStorage.getItem(jobDescription);
            if (cachedSummary) {
                setSummary(cachedSummary); // Use the cached summary
            } else {
                fetchSummary(jobDescription); // Fetch the summary if not cached
            }
        }
    }, [jobDescription]);

    const fetchSummary = async (description) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://impact-api-dev.onrender.com/summarize', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'x-api-key': 'your-secret-key'
                },
                body: JSON.stringify({ jobDescription: description }),
            });
            const data = await response.json();
            if (response.ok) {
                setSummary(data.summary);
                // Save the summary in localStorage
                localStorage.setItem(description, data.summary);
            } else {
                setError(data.error || "Failed to fetch summary.");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        }
        setLoading(false);
    };

    if (loading) return <p>Loading summary...</p>;
    if (error) return <p>Error: {error}</p>;

    return <p>{summary}</p>;
}

export default JobSummary;
