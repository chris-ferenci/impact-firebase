import React from 'react';
import { Link } from 'react-router-dom';
import {IoLocationSharp, IoBusinessSharp} from 'react-icons/io5'
import './JobCard.css';

function JobCard({ job, getCountryFlag }) {

    const categories = [
        'Administration/Finance',
        'Advocacy/Communications',
        'Donor Relations/Grants Management',
        'Human Resources',
        'Information and Communications Technology',
        'Information Management',
        'Logistics/Procurement',
        'Monitoring and Evaluation',
        'Program/Project Management'
    ];

    const getCategoryColor = (category) => {
        switch (category) {
            case categories[0]:
                return 'text-indigo-800 bg-indigo-100';
            case categories[1]:
                return 'text-rose-800 bg-rose-100';
            case categories[2]:
                return 'text-pink-800 bg-pink-100';
            case categories[3]:
                return 'text-fuchsia-800 bg-fuchsia-100';
            case categories[4]:
                return 'text-violet-800 bg-violet-100';
            case categories[5]:
                return 'text-cyan-800 bg-cyan-100';
            case categories[6]:
                return 'text-teal-800 bg-teal-100';
            case categories[7]:
                return 'text-emerald-800 bg-emerald-100';
            default:
                return 'text-amber-800 bg-amber-100';
        }
    };

    const generateJobUrl = (jobId) => {
        return `/jobs/${jobId}`;
      };

    return (
        <div className="job-card shadow-lg p-8">

            <Link className="text-neutral-900 hover:underline hover:text-neutral-900" to={generateJobUrl(job.id)}>
                <h2 className='text-2xl font-bold mb-4 tracking-tight truncate-2-lines' title={job.fields.title}>{job.fields.title}</h2>
            </Link>
            
            <p className={`inline-block mb-4 px-4 py-1 text-sm font-medium rounded ${getCategoryColor(job.fields.career_categories && job.fields.career_categories[0].name)}`}>
                {job.fields.career_categories && job.fields.career_categories[0].name}
            </p>
            <p className='text-xs font-bold text-neutral-900'>Organization</p>
            
            {/* <p className='text-md font-medium mb-2 text-gray-600'><IoBusinessSharp className='inline-block mr-1'/>{job.fields.source && job.fields.source[0].name}</p> */}
            <p className='text-md text-neutral-900 font-regular mb-2'>{job.fields.source && job.fields.source[0].name}</p>

            <p className='text-xs font-bold text-neutral-900'>Region</p>
            {/* <p className='text-md font-medium text-gray-600 mb-8'><IoLocationSharp className='inline-block mr-1'/>{job.fields.country && job.fields.country[0].name}</p> */}
            <p className='text-md font-regular text-neutral-900 mb-8'>{job.fields.country && job.fields.country[0].name ? `${getCountryFlag(job.fields.country && job.fields.country[0].name)} ${job.fields.country[0].name}` : "Unknown"}</p>


            <div className='flex flex-row gap-2 bottom-0'>
                <div className='basis-1/2'>
                <Link to={generateJobUrl(job.id)}>
                    <button className='w-full bg-rose-600 rounded border-2 border-rose-600 text-white px-8 py-2'>View Details</button>
                </Link>
                </div>
                <div className='basis-1/2'>
                {/* <Link>
                    <button className='w-full basis-1/2 bg-neutral-100 rounded border-2 border-neutral-100 text-neutral-900 px-8 py-2'>Save</button>
                </Link> */}
                </div>
            </div>
        </div>
    );
}

export default JobCard;
