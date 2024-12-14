import React from 'react';
import JobCard from '../JobCard/JobCard';
import JobTypeFilter from '../JobTypeFilter/JobTypeFilter';
import Spinner from '../Spinner/Spinner';
import CountryList from '../CountryList/CountryList';
import JobsPerPageSelect from '../JobsPerPageSelect/JobsPerPageSelect';


function JobListingBoard({ filteredJobs, getCountryFlag, isLoading, countries, handleCountrySelect  }) {

  console.log("Filtered jobs: " + filteredJobs)
  console.log("Job listing boards:", countries)
  
    
  return (
    <div className='job-container bg-gray-100 py-8 px-8 md:px-48 min-h-[600px]'>

        <div className='flex justify-center mb-8'>
          <CountryList 
            countries={countries} 
            onSelectCountry={handleCountrySelect} 
            getCountryFlag={getCountryFlag} 
            maxCountries={5}
          />
        </div>
        
      
        {isLoading ? (
          
          <div className="flex justify-center items-center h-full mt-8">
            
            <Spinner />
          </div>

        ) : (
          
          <div className="job-list flex flex-col">
            

            {filteredJobs.map(job => 
            <JobCard key={job.id} job={job} getCountryFlag={getCountryFlag} />
      
            )}

            
            </div>
            
            
        )}

    </div>
  );
}

export default JobListingBoard;