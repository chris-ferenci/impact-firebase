import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import parser, { domToReact, attributesToProps } from 'html-react-parser';
import './JobDetails.css';
import Header from '../Header/Header';
import JobSummary from '../JobSummary/JobSummary';
import { IoChevronBack } from "react-icons/io5"

function JobDetails() {

    const { id } = useParams();
    const [data, setData] = useState([]);

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

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
        return date.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
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
        {data.map((data) => (
            <div className="job-details flex flex-row w-full">
                <div className='w-2/3 flex flex-col text-neutral-900 bg-white'>
                    <div key={data.id}>
                        <div className='p-8'>
                            <button className='bg-white mb-8 p-2 rounded font-bold text-lg flex flex-row text-gray-900 items-center hover:text-rose-600' onClick={handleBackClick}><i className="align-middle"><IoChevronBack /></i>Back</button>
                            <h1 className='capitalize font-bold text-4xl tracking-tight text-neutral-900 mb-4'>{data.fields.title}</h1>                        
                            
                            <div className='flex flex-row gap-8 p-4 rounded-md bg-gray-100 mb-8' key={data.id}>
                                <div className='flex flex-col'>
                                <h2 className='font-medium text-gray-700'>Region</h2><p>{data.fields.country && data.fields.country[0].name}</p>
                                </div>

                                <div className='flex flex-col'>
                                <h2 className='font-medium text-gray-700'>Source</h2><p>{data.fields.source && data.fields.source[0].name}</p>
                                </div>

                                <div className='flex flex-col'>
                                <h2 className='font-medium text-gray-700'>Closing Date</h2><p>{formatDateTime(data.fields.date && data.fields.date.closing)}</p>
                                </div>
                            </div>

                            <a className='font-bold bg-rose-600 px-8 py-4 rounded hover:bg-rose-800 text-white hover:text-white' href={data.fields.url} target="_blank" rel="noreferrer">Apply</a>
                        </div>

                        <div className='px-8'>
                            <h2 className='mb-4 text-lg text-neutral-500 font-semibold border-b-2 border-t-2 py-2 border-neutral-300'>Job Description</h2>
                            {/* Job Summary Component */}
                            
                            <div className='body-html text-md mb-4 leading-relaxed '>{parser(data.fields['body-html'], customParserOptions)}</div>
                        
                            <a className='font-bold bg-rose-600 text-white px-16 py-2 rounded hover:bg-rose-800 hover:text-white' href={data.fields.url} target="_blank" rel="noreferrer">Apply</a>
                        </div>

                    </div>
                </div>

                <div className='flex-shrink-0 h-screen w-1/3 text-neutral-900'>
                    <div className='bg-gray-50 h-screen p-4 fixed flex flex-col'>
                        <div className='flex justify-between items-center'>
                        <h2 className="mb-4 text-lg font-bold italic">ImpactAI Facts</h2>
                        <p className='text-sm text-neutral-500 font-medium italic'>Generated by AI</p>
                        </div>

                        <div className='bg-white p-4 rounded-md'>
                            <h2 className="mb-4 font-bold italic">Summary</h2>
                            <JobSummary jobDescription={data.fields['body-html']} />
                        </div>

                        <p className='my-4 text-sm text-neutral-600 font-semibold italic'>Ask About the Role</p>

                        <div className='flex flex-row flex-wrap gap-2 font-semibold'>
                            <a className=' 
                            bg-rose-50 
                            border-rose-200
                            border
                            text-rose-800 px-4 py-2 
                            rounded 
                            hover:bg-rose-200 
                            hover:text-rose-800 
                            cursor-pointer' 
                            >Salary</a>
                        
                            <a className='
                            bg-rose-50 
                            border-rose-200
                            border
                            text-rose-800 px-4 py-2 
                            rounded 
                            hover:bg-rose-200 
                            hover:text-rose-800 cursor-pointer ' 
                            >Education Requirements</a>
                        
                            <a className='
                            bg-rose-50 
                            border-rose-200
                            border
                            text-rose-800 px-4 py-2 
                            rounded 
                            hover:bg-rose-200 
                            hover:text-rose-800 cursor-pointer ' 
                            >Experience</a>
                        </div>

                        
                    </div>
                </div>3

            </div>
            ))}
        </>
    );
}

export default JobDetails;
