import React from 'react';

function CountryList({ onSelectJobType, jobTypes }) {

    console.log(jobTypes.embedded)
    return (
        <div className="w-full country-list">
            {/* <h3 className='text-lg mb-4 font-semibold text-center'>Browse by type</h3>
            <ul className="list-none flex flex-wrap place-content-center">
                {jobTypes.map(jobType => (
                    <li className="mr-2 mb-2 mt-2" key={jobType.value}>
                        <button className='rounded font-medium bg-white border-t-0 border-l-0 border-r-0 border-b-0 hover:border-b-2 hover:border-neutral-900 text-neutral-900 py-2 px-4' href="#" onClick={e => {
                            e.preventDefault();
                            onSelectJobType(jobType.value);
                        }}>
                            <p>{jobType.value} <span className='text-xs text-neutral-500'>({jobType.count})</span></p>
                        </button>
                    </li>
                ))}
            </ul> */}
        </div>
    );
}

export default CountryList;