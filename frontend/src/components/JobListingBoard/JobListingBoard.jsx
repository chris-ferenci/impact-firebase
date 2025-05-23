import React, {useState, useMemo, useEffect} from 'react';
import JobCard from '../JobCard/JobCard';
import JobTypeFilter from '../JobTypeFilter/JobTypeFilter';
import Spinner from '../Spinner/Spinner';
import CountryList from '../CountryList/CountryList';
import JobsPerPageSelect from '../JobsPerPageSelect/JobsPerPageSelect';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { motion } from "framer-motion";



function JobListingBoard({ getCountryFlag, selectedCountry, handleCountrySelect }) {

  const username = 'aidify-user-' + uuidv4();

  const [data, setData] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [offset, setOffset] = useState(0); // New state variable for pagination offset

  const [selectedJobType, setSelectedJobType] = useState('');
  const [jobsPerPage, setJobsPerPage] = useState(10);

  //Utilities
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const filteredJobs = useMemo(
    () =>
      data.filter((job) => {
        const matchesCountry =
         !selectedCountry ||
          (job.fields.country && job.fields.country[0].name === selectedCountry);
        const matchesJobType = 
          !selectedJobType ||
          (job.fields.type && job.fields.type[0].name === selectedJobType);
        
        return matchesCountry && matchesJobType;
      }),
    [data, selectedCountry, selectedJobType]
  );

  const loadMoreJobs = async () => {
    const newOffset = offset + jobsPerPage;
    setOffset(newOffset); // Update state first
    await fetchJobs(newOffset, true, selectedCountry, jobsPerPage); // Use updated offset
  };

  // Fetching jobs

  const fetchJobs = async (
    newOffset = 0, 
    isMore = false, 
    country = '', 
    limit = jobsPerPage
  ) => {

    setIsLoading(!isMore);
    setIsMoreLoading(isMore);
  
    const payload = {
      offset: newOffset,
      limit: jobsPerPage,
      preset: "latest",
      profile: "list",
      fields: {
        include: ["career_categories.name", "source.shortname", "type.name"],
      },
    };

    // Add a filter if a country is selected
    if (country) {
      console.log("filtered country", country)
      payload.filter = {
        field: 'country.name',
        value: country
      };
    }

  
    try {
      const response = await axios.post(
        `https://api.reliefweb.int/v1/jobs?appname=${username}`,
        payload
      );
      const updatedData = response.data.data.map((job) => ({
        ...job,
        fields: { ...job.fields, title: toTitleCase(job.fields.title) },
      }));

      // Set total jobs from the metadata returned by the API
      const totalCount = response.data?.totalCount || 0;
      console.log("Total count", totalCount)
      setTotalJobs(totalCount);
  
      setData((prevData) => [...prevData, ...updatedData]);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };


  useEffect(() => {
    // When selectedCountry changes, re-fetch data
    setData([]);
    setOffset(0);
    fetchJobs(0, false, selectedCountry, jobsPerPage);
  }, [selectedCountry, jobsPerPage]);
  
    
  return (
    <div className='bg-gray-100 py-8 md:px-48 min-h-[600px]'>
      <div className='flex flex-col w-full bg-neutral-100 px-8 md:px-16'>
        <h2 className='text-center text-xl text-neutral-800 font-bold'>
          Latest Opportunities Around the Globe
          </h2>
        <p className='text-center my-2 text-gray-700 font-medium'>
          Displaying {Math.min(filteredJobs.length, jobsPerPage)} of {totalJobs} Opportunities
        </p>
      </div>

      <div className='flex mb-8 justify-center'>
        <CountryList 
          onSelectCountry={handleCountrySelect} 
          getCountryFlag={getCountryFlag} 
          maxCountries={5}
        />
        
      </div>

        {/* Jobs Per Page Select */}
        <div className='flex justify-between mb-4 items-center'>

          <h2 className='text-center text-xl text-gray-900 font-bold'>
            Opportunities in {selectedCountry ? selectedCountry : 'All Countries'}
          </h2>


          <div className='flex flex-col'>
              <JobsPerPageSelect 
                value={jobsPerPage} 
                onChange={(newLimit) => {
                  setJobsPerPage(newLimit);
                  setOffset(0);
                  setData([]);
                  fetchJobs(0, false, selectedCountry, newLimit);
                }}
                options={[10, 25]}
              />

          </div>

        </div>

        <div className="job-list flex flex-col min-h-[400px]">
  
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <div className="job-list flex flex-col">

              {filteredJobs.slice(0, jobsPerPage).map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                >
                  <JobCard key={job.id} job={job} getCountryFlag={getCountryFlag} />
                </motion.div>
              ))}
              {/* End Job list */}

              {filteredJobs.length < totalJobs && filteredJobs.length > 0 && (
              <div className='flex w-full bg-gray-100 justify-center pb-8'>
                  <button
                      onClick={loadMoreJobs}
                      disabled={isMoreLoading}
                      className='bg-rose-600 rounded border-2 border-rose-600 text-white px-8 py-2'>
                      {isMoreLoading ? 'Loading...' : 'Load More'}
                  </button>
              </div>
              )}
            </div>
            
          )}
          </div>

    </div>
  );
}

export default JobListingBoard;