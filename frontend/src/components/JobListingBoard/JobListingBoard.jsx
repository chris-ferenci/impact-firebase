import React, {useState, useMemo, useEffect} from 'react';
import JobCard from '../JobCard/JobCard';
import JobTypeFilter from '../JobTypeFilter/JobTypeFilter';
import Spinner from '../Spinner/Spinner';
import CountryList from '../CountryList/CountryList';
import JobsPerPageSelect from '../JobsPerPageSelect/JobsPerPageSelect';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


function JobListingBoard({ getCountryFlag }) {

  const username = 'aidify-user-' + uuidv4();

  const [data, setData] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [offset, setOffset] = useState(0); // New state variable for pagination offset

  const [selectedCountry, setSelectedCountry] = useState(''); // This will store the clicked country
  const [selectedJobType, setSelectedJobType] = useState('');
  const [jobsPerPage, setJobsPerPage] = useState(10);

  //Utilities
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // Callback that gets passed down to CountryList

  const handleCountrySelect = async (country) => {
    setSelectedCountry(country);
    // When a country is selected, reset offset and data, then fetch filtered jobs.
    setOffset(0);
    setData([]);
    await fetchJobs(0, false, country, selectedJobType, jobsPerPage);
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

    console.log('fetchJobs limit:', jobsPerPage); // Debug line
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
      payload.filter = {
        field: 'country',
        value: country
      };
    }

    // If you also want to filter by jobType on the server side:
    // if (jobType) {
    //   payload.filter = {
    //     ...payload.filter,
    //     field: 'type.name',
    //     value: jobType
    //   };
    // }
  
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
    // Fetch without filters
    const fetchInitialData = async () => {
      try {
        const jobsRequest = axios.post(
          `https://api.reliefweb.int/v1/jobs?appname=${username}`,
          {
            offset: 0,
            limit: jobsPerPage,
            preset: "latest",
            profile: "list",
            fields: { include: ["career_categories.name", "source.shortname", "type.name"] },
          }
        );
  
        const jobsResponse = await jobsRequest;
  
        const updatedData = jobsResponse.data.data.map((job) => ({
          ...job,
          fields: { ...job.fields, title: toTitleCase(job.fields.title) },
        }));

        const totalCount = jobsResponse.data?.totalCount || 0;
        setTotalJobs(totalCount);
        setData(updatedData);
      } catch (error) {
        console.error("Failed to fetch initial job data:", error);
      }
    };
  
    fetchInitialData();
  }, [username, jobsPerPage]);
  
    
  return (
    <div className='job-container bg-gray-100 py-8 px-8 md:px-48 min-h-[600px]'>

        <div className='flex justify-center mb-8'>
          <CountryList 
            onSelectCountry={handleCountrySelect} 
            getCountryFlag={getCountryFlag} 
            maxCountries={5}
          />
          
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

          <div className='mb-4 text-gray-700 font-medium'>
            Displaying {Math.min(filteredJobs.length, jobsPerPage)} of {totalJobs} Results
          </div>

            {filteredJobs.slice(0, jobsPerPage).map(job => (
              <JobCard key={job.id} job={job} getCountryFlag={getCountryFlag} />
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
  );
}

export default JobListingBoard;