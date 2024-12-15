import React, {useState} from 'react';
import JobCard from '../JobCard/JobCard';
import JobTypeFilter from '../JobTypeFilter/JobTypeFilter';
import Spinner from '../Spinner/Spinner';
import CountryList from '../CountryList/CountryList';
import JobsPerPageSelect from '../JobsPerPageSelect/JobsPerPageSelect';


function JobListingBoard({ 
  filteredJobs, getCountryFlag, isLoading, countries, handleCountrySelect  }) {

  // State for controlling how many countries are shown
  const [visibleCountryCount, setVisibleCountryCount] = useState(5);

  // State for controlling how many jobs per page are displayed
  const [jobsPerPage, setJobsPerPage] = useState(10);

  const handleShowMoreCountries = () => {
    console.log("more countries click")
    // Increase the number of visible countries by a fixed amount
    // You can choose your increment value, e.g., +5
    setVisibleCountryCount(prevCount => prevCount + 5);
  };
  
    
  return (
    <div className='job-container bg-gray-100 py-8 px-8 md:px-48 min-h-[600px]'>

        <div className='flex justify-center mb-8'>
          <CountryList 
            countries={countries} 
            onSelectCountry={handleCountrySelect} 
            getCountryFlag={getCountryFlag} 
            maxCountries={5}
          />
          {visibleCountryCount < countries.length && (
          <button 
            onClick={handleShowMoreCountries} 
            className='mt-4 bg-rose-600 text-white px-4 py-2 rounded-md'
          >
            Show More Countries
          </button>
        )}
        </div>

        {/* Jobs Per Page Select */}
        <div className='flex justify-end mb-8'>
          <JobsPerPageSelect 
            value={jobsPerPage} 
            onChange={setJobsPerPage} 
            options={[10, 30, 50]}
          />
        </div>
      
        {isLoading ? (
          <div className="flex justify-center items-center h-full mt-8">
            <Spinner />
          </div>
        ) : (
          <div className="job-list flex flex-col">
            {filteredJobs.slice(0, jobsPerPage).map(job => (
              <JobCard key={job.id} job={job} getCountryFlag={getCountryFlag} />
            ))}
          </div>
        )}

    </div>
  );
}

export default JobListingBoard;