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

    const categoryMapping = {
        'Administration/Finance': 'Admin & Finance',
        'Advocacy/Communications': 'Advocacy & Comms',
        'Donor Relations/Grants Management': 'Grants & Donors',
        'Human Resources': 'HR',
        'Information and Communications Technology': 'IT & Tech',
        'Information Management': 'Info Mgmt',
        'Logistics/Procurement': 'Logistics & Supply',
        'Monitoring and Evaluation': 'Monitoring & Eval',
        'Program/Project Management': 'Project Mgmt'
    };

    const getCategoryDisplayName = (category) => {
        return categoryMapping[category] || category; // Fallback to original if not mapped
    };

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
        <div className="bg-white job-card flex flex-wrap md:grid md:grid-cols-5 gap-4 justify-between shadow-lg p-6 items-center">

            <div className="flex flex-col md:col-span-2">
                <p className='text-md text-neutral-700 font-regular'>{job.fields.source && job.fields.source[0].name}</p>
                <Link className="text-neutral-900 hover:underline hover:text-neutral-900" to={generateJobUrl(job.id)}>
                    <h2 className='text-lg font-bold tracking-tight w-full truncate-2-lines' title={job.fields.title}>{job.fields.title}</h2>
                </Link>
            </div>

            {/* Region */}

            <div className="flex flex-col justify-center">
                <label className='text-xs font-bold text-neutral-900'>Region</label>
                <p className='text-md font-regular text-neutral-900'>{job.fields.country && job.fields.country[0].name ? `${getCountryFlag(job.fields.country && job.fields.country[0].name)} ${job.fields.country[0].name}` : "Unknown"}</p>
            </div> 

            {/* Category Tag */}

            <div className='flex flex-col items-center'>
                <span 
                    className={`px-2 py-1 flex text-xs font-medium rounded-full ${getCategoryColor(job.fields.career_categories && job.fields.career_categories[0].name)}`}>
                    {getCategoryDisplayName(job.fields.career_categories && job.fields.career_categories[0].name)}
                </span>
            </div>

            {/* View Details Button */}

            <div className='flex col-span-4 md:col-span-1 justify-end'>
                <Link to={generateJobUrl(job.id)}>
                    <button className='bg-rose-600 hover:bg-rose-800 rounded  text-white px-4 py-2'>View Details</button>
                </Link>
            </div>
        </div>
    );
}

export default JobCard;
