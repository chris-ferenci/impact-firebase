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

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    const getCountryFlag = (countryName) => {
        return countryFlags[countryName] || ""; // This will return the flag emoji or an empty string if not found
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, []);

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
            
        })
        .finally(() => setLoading(false));
    
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

    if (loading) {
        return (
            <div className="w-full min-h-screen p-8 md:p-16 animate-pulse">
                <div className="h-6 bg-gray-300 w-1/3 mb-4 rounded"></div>
                <div className="h-10 bg-gray-200 w-2/3 mb-8 rounded"></div>
                <div className="h-4 bg-gray-200 w-full mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 w-5/6 mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
            </div>
        );
    }

    return (
        <>
            {data.map((job) => (
                <div className="job-details w-full text-neutral-900" key={job.id}>
                    <div className="md:grid md:grid-cols-3 md:gap-8">
                        
                        {/* Left Column */}
                        <div className="md:col-span-2 md:overflow-y-auto md:h-screen p-8 md:p-16">
                            <button
                                className="bg-white mb-8 rounded font-bold text-lg flex items-center text-gray-900 hover:text-rose-600"
                                onClick={() => window.history.back()}
                            >
                                <IoChevronBack className="mr-2" /> Back
                            </button>
                            
                            <div className='md:border-l-4 md:border-rose-500 md:pl-4'>
                                <p className='text-xl'>{job.fields.source && job.fields.source[0].name}</p>
                                <h1 className="font-bold text-4xl text-neutral-900 mb-4 capitalize">
                                    {job.fields.title}
                                </h1>
                            

                                <div className="flex gap-8 mb-4">
                                    <div>
                                        <h2 className="font-bold">Region</h2>
                                        <p>{job.fields.country?.[0]?.name || "Unknown"}</p>
                                    </div>

                                    <div>
                                        <h2 className="font-bold">Closing Date</h2>
                                        <p>{new Date(job.fields.date?.closing ? new Date(job.fields.date.closing).toLocaleDateString() : "N/A").toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-lg font-semibold py-2 mt-8 mb-2 text-neutral-700"><span className='border-b-2 border-rose-500 pb-1'>Description</span></h2>
                            <div
                                className="text-lg leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: job.fields['body-html'] || "<p>No description available.</p>" }} // Safe Fallback
                            />
                        </div>

                        {/* Right Column for Larger Screens */}
                        <div className="hidden md:block md:col-span-1 d:sticky md:top-0 md:h-screen px-8 md:pt-16">
                            <div className="bg-white p-6 border-2 border-rose-200 rounded-md">
                                <div className='flex flex-row items-center'>
                                    <h2 className="text-lg font-bold">Impact Intelligence</h2>
                                    <p className='ml-2 font-semibold text-neutral-500 text-xs'>BETA</p>
                                </div>
                                <p className="text-sm italic text-neutral-600 mb-2">
                                    Summarized by OpenAI
                                </p>
                                <JobSummary jobDescription={job.fields['body-html']} />
                            </div>

                            <a
                            className="block mt-8 text-center font-bold bg-rose-600 px-8 py-4 rounded hover:bg-rose-800 text-white"
                            href={job.fields.url}
                            target="_blank"
                            rel="noreferrer"
                            >
                            Apply
                            </a>

                        </div>
                    </div>

                    {/* Sticky Footer for Small Screens */}
                    <div className="md:hidden fixed bottom-0 w-full bg-white border-t-4 border-rose-600">
                        <button
                            className="flex justify-between items-center w-full p-4 text-left"
                            onClick={toggleFooter}
                        >
                            <div className='flex flex-row items-center'>
                                <span className="text-rose-600 font-bold">Impact Intelligence</span>
                                <span className='ml-2 font-semibold text-xs text-neutral-500'>BETA</span>
                            </div>
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
                            className="block text-center font-bold bg-rose-600 px-8 py-4 hover:bg-rose-800 text-white hover:text-white"
                            href={job.fields.url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Apply
                        </a>
                    </div>
                </div>
            ))}
        </>
    );
}

export default JobDetails;
