import React from 'react';
import JobCard from '../JobCard/JobCard';
import JobTypeFilter from '../JobTypeFilter/JobTypeFilter';
import Spinner from '../Spinner/Spinner';
import CountryList from '../CountryList/CountryList';

function JobListingBoard({ filteredJobs, getCountryFlag, jobTypes, onSelectJobType, isLoading }) {

  console.log("Filtered jobs: " + filteredJobs)
    
  return (
    <div className='job-container bg-gray-50 py-8 px-16'>

      {/* <CountryList countries={countries} onSelectCountry={handleCountrySelect} getCountryFlag={getCountryFlag}/> */}
      <JobTypeFilter jobTypes={jobTypes} onSelectJobType={onSelectJobType} />

      
        {isLoading ? (
          
          <div className="flex justify-center items-center">
            <Spinner />
          </div>

        ) : (
          <div className="job-list grid md:grid-cols-3 sm:grid-cols-1">
            {filteredJobs.map(job => 
            <JobCard key={job.id} job={job} getCountryFlag={getCountryFlag} />
            )}
            </div>
        )}

    </div>
  );
}

export default JobListingBoard;