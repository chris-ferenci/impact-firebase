import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


function JobSummary({ jobDescription }) {
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dots, setDots] = useState(""); // For animated dots

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

    useEffect(() => {
        // Animate dots
        if (loading) {
            const interval = setInterval(() => {
                setDots((prev) => (prev.length < 3 ? prev + "." : ""));
            }, 500);
            return () => clearInterval(interval);
        }
    }, [loading]);

    const fetchSummary = async (description) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("https://impact-api-dev.onrender.com/summarize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'x-api-key': 'SBB8WgHSihGKtWd7RyAo4Qx3y7cFrNQ3vd7Qs86b9qs='
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

    if (loading) return <div className="text-sm text-neutral-600">Summarizing<span>{dots}</span></div>;
    if (error) return <p>Error: {error}</p>;

    return(  
        <div className="overflow-auto prose prose-sm sm:prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}
            components={{
                h1: ({node,...props}) => (
                  <h1
                    className="text-xl font-semibold mb-2 mt-4"  // smaller than prose’s default
                    {...props}
                  />
                ),
                h2: ({node,...props}) => (
                  <h2
                    className="text-lg font-semibold mb-1 mt-3"
                    {...props}
                  />
                ),
                h3: ({node,...props}) => (
                  <h3
                    className="text-base font-medium mb-1 mt-2"
                    {...props}
                  />
                ),
                p: ({node,...props}) => (
                  <p className="mb-2 leading-snug" {...props}/>
                ),
                li: ({node,...props}) => (
                  <li className="mb-1" {...props}/>
                ),
              }}
            >
            {summary}
            </ReactMarkdown>
        </div>
    );
}

export default JobSummary;
