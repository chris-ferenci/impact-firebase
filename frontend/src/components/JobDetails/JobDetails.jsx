import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import parser, { domToReact, attributesToProps } from 'html-react-parser';
import './JobDetails.css';
import Header from '../Header/Header';
import JobSummary from '../JobSummary/JobSummary';
import { IoChevronBack, IoChevronDown, IoChevronUp } from "react-icons/io5";
import countryFlags from '../../data/countryFlags.json'

function JobDetails() {

    const { id } = useParams();
    const [data, setData] = useState([]);

    const [isFooterOpen, setIsFooterOpen] = useState(true);
    const toggleFooter = () => setIsFooterOpen(!isFooterOpen);

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    const getCountryFlag = (countryName) => {
        return countryFlags[countryName] || ""; // This will return the flag emoji or an empty string if not found
    }

    useEffect(() => {

        // Default job fetching
        const postData = {
            "offset": 0,
            "limit": 1,
            "profile": "list",
            "filter":{
                "field": "id",
                "value": id,
            },
            "fields":{
                "include": ["body-html"]
            }
        };

    
        fetch('https://api.reliefweb.int/v1/jobs?appname=aidify-user-0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(responseData => {
            console.log(responseData.data)
            // Check if data is available and then apply title case to titles
            if (responseData.data && responseData.data.length > 0) {
                responseData.data.forEach(item => {
                    item.fields.title = toTitleCase(item.fields.title);
                });
                setData(responseData.data);
            }
            
        });
    
    }, []);

    // HELPER FUNCTIONS

    function toTitleCase(text) {
        return text.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    function formatDateTime(isoString) {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', { dateStyle: 'long'});
      }

    const customParserOptions = {
        replace: ({ name, children, attribs }) => {
            if (name === 'h2') {
                // Convert <h2> tags to <div> tags with a custom class for styling
                return <div className="custom-section">{domToReact(children)}</div>;
            }
        }
    };

    return (
        <>
            {data.map((job) => (
                <div className="job-details w-full text-neutral-900" key={job.id}>
                    <div className="md:grid md:grid-cols-3 md:gap-8 p-8">
                        
                        {/* Left Column */}
                        <div className="md:col-span-2">
                            <button
                                className="bg-white mb-8 rounded font-bold text-lg flex items-center text-gray-900 hover:text-rose-600"
                                onClick={() => window.history.back()}
                            >
                                <IoChevronBack className="mr-2" /> Back
                            </button>

                            <p className='text-xl'>{job.fields.source && job.fields.source[0].name}</p>
                            <h1 className="font-bold text-4xl text-neutral-900 mb-4 capitalize">
                                {job.fields.title}
                            </h1>

                            <div className="flex gap-8 mb-4">
                                <div>
                                    <h2 className="font-bold">Region</h2>
                                    <p>{job.fields.country[0].name}</p>
                                </div>

                                <div>
                                    <h2 className="font-bold">Closing Date</h2>
                                    <p>{new Date(job.fields.date.closing).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold py-2">Full Job Description</h2>
                            <div
                                className="text-lg leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: job.fields['body-html'] }}
                            />
                        </div>

                        {/* Right Column for Larger Screens */}
                        <div className="hidden md:block md:col-span-1">
                            <div className="bg-white p-6 border-2 border-rose-200 rounded-md">
                                <h2 className="text-lg font-bold">AI Summary</h2>
                                <p className="text-sm italic text-neutral-600 mb-2">
                                    Summarized by OpenAI
                                </p>
                                <JobSummary jobDescription={job.fields['body-html']} />
                            </div>
                        </div>
                    </div>

                    {/* Sticky Footer for Small Screens */}
                    <div className="md:hidden fixed bottom-0 w-full bg-white border-t-4 border-rose-600">
                        <button
                            className="flex justify-between items-center w-full p-4 text-left font-bold"
                            onClick={toggleFooter}
                        >
                            <span className="text-rose-600">AI Summary</span>
                            {isFooterOpen ? (
                                <IoChevronDown className="w-6 h-6 text-rose-600" />
                            ) : (
                                <IoChevronUp className="w-6 h-6 text-rose-600" />
                            )}
                        </button>

                        {isFooterOpen && (
                            <div className="p-4 border-t-2 border-rose-200">
                                <JobSummary jobDescription={job.fields['body-html']} />
                            </div>
                        )}

                        <a
                            className="block text-center font-bold bg-rose-600 px-8 py-4 rounded hover:bg-rose-800 text-white"
                            href={job.fields.url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Apply Now
                        </a>
                    </div>
                </div>
            ))}
        </>
    );
}

export default JobDetails;
