import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import parser, { domToReact, attributesToProps } from 'html-react-parser';
import './JobDetails.css';
import Header from '../Header/Header';
import JobSummary from '../JobSummary/JobSummary';
import { IoChevronBack } from "react-icons/io5"
import countryFlags from '../../data/countryFlags.json'

function JobDetails() {

    const { id } = useParams();
    const [data, setData] = useState([]);

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
        {data.map((data) => (
            <div className="job-details w-full ">
                <div key={data.id}>
                    <div className='flex flex-col md:w-2/3 md:grid md:grid-rows-3 md:grid-flow-col text-neutral-900'>
                        {/* Section 1 - Title and Region */}
                        <div className='flex flex-col md:col-span-2 p-8'>

                            <button className='bg-white mb-8 rounded font-bold text-lg flex flex-row text-gray-900 items-center hover:text-rose-600' onClick={handleBackClick}><i className="align-middle"><IoChevronBack /></i>Back</button>
                            
                            <div className='mb-4'>
                                <p className='text-xl'>{data.fields.source && data.fields.source[0].name}</p>
                                <h1 className='capitalize font-bold text-4xl tracking-tight text-neutral-900 mb-4'>
                                    {data.fields.title}
                                </h1>      
                            </div>                  
                            
                            <div className='flex flex-row gap-8 mb-4' key={data.id}>
                                <div className='flex flex-col'>
                                    <h2 className='font-bold text-neutral-900'>Region</h2>
                                    
                                    <div className='flex flex-row'>
                                        <span className='mr-2'>{getCountryFlag(data.fields.country && data.fields.country[0].name)}</span>
                                        <p>{data.fields.country && data.fields.country[0].name}</p>
                                    </div>
                                </div>

                                <div className='flex flex-col'>
                                    <h2 className='font-bold text-gray-900'>Closing Date</h2>
                                    <p>{formatDateTime(data.fields.date && data.fields.date.closing)}</p>
                                </div>
                            </div>

                            {/* Section 2 - AI Summary */}
                            <div className='text-neutral-900 md:row-span-3'>
                                <div className='flex flex-col'>
                                    <div className='flex flex-col'>
                                        <h2 className="text-lg font-bold">AI Summary</h2>
                                        <p className='text-sm text-neutral-600 italic mb-2'>Summarized by OpenAI</p>
                                    </div>

                                    <div className='bg-white text-lg p-4 rounded-md border-2 border-rose-200'>
                                        <JobSummary jobDescription={data.fields['body-html']} />
                                    </div>
                                </div>
                            </div>      

                            {/* Section 3 - Description */}

                            <div className='md:pb-32'>
                                <h2 className='text-xl text-neutral-900 font-semibold py-2'>Full Job Description</h2>
                                
                                <div className='body-html text-lg text-neutral-900 mb-4 leading-relaxed '>
                                    {parser(data.fields['body-html'], customParserOptions)}
                                </div>
                            </div>

                        </div>

                                          
    
                    </div>
                    

                    {/* Footer */}
                    <div className='md:hidden flex w-full p-4 fixed bottom-0 bg-white justify-end border-t-4 border-rose-600'>
                        <a className='font-bold bg-rose-600 px-8 py-4 rounded hover:bg-rose-800 text-white hover:text-white' href={data.fields.url} target="_blank" rel="noreferrer">Apply</a>
                    </div>

                </div>

            </div>
            ))}
        </>
    );
}

export default JobDetails;
