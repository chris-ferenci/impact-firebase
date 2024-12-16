import React, {useState, useMemo, useEffect} from 'react';
import JobCard from '../JobCard/JobCard';
import JobTypeFilter from '../JobTypeFilter/JobTypeFilter';
import Spinner from '../Spinner/Spinner';
import CountryList from '../CountryList/CountryList';
import JobsPerPageSelect from '../JobsPerPageSelect/JobsPerPageSelect';
import axios from 'axios';

import { v4 as uuidv4 } from 'uuid';



function JobListingBoard({ 
  getCountryFlag  }) {

  const username = 'aidify-user-' + uuidv4();


  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [offset, setOffset] = useState(0); // New state variable for pagination offset

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(''); // This will store the clicked country
  const [selectedJobType, setSelectedJobType] = useState('');
  const [countries, setCountries] = useState([]);
    

  // State for controlling how many countries are shown
  const [visibleCountryCount, setVisibleCountryCount] = useState(5);

  // State for controlling how many jobs per page are displayed
  const [jobsPerPage, setJobsPerPage] = useState(10);

  //Utilities
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // Handlers

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    fetchCountry(country);
  };

  const handleShowMoreCountries = () => {
    console.log("more countries click")
    // Increase the number of visible countries by a fixed amount
    // You can choose your increment value, e.g., +5
    setVisibleCountryCount(prevCount => prevCount + 5);
  };

  const filteredJobs = useMemo(
    () =>
      data.filter(
        (job) =>
          job.fields.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!selectedCountry ||
            (job.fields.country && job.fields.country[0].name === selectedCountry)) &&
          (!selectedJobType ||
            (job.fields.type && job.fields.type[0].name === selectedJobType))
      ),
    [data, searchTerm, selectedCountry, selectedJobType]
  );

  const loadMoreJobs = async () => {
    const newOffset = offset + 9;
    setOffset(newOffset); // Update state first
    await fetchJobs(newOffset, true); // Use updated offset
  };

  // Fetching jobs

  const fetchJobs = async (newOffset = 0, isMore = false) => {
    setIsLoading(!isMore);
    setIsMoreLoading(isMore);
  
    const payload = {
      offset: newOffset,
      limit: 9,
      preset: "latest",
      profile: "list",
      fields: {
        include: ["career_categories.name", "source.shortname", "type.name"],
      },
    };
  
    try {
      const response = await axios.post(
        `https://api.reliefweb.int/v1/jobs?appname=${username}`,
        payload
      );
      const updatedData = response.data.data.map((job) => ({
        ...job,
        fields: { ...job.fields, title: toTitleCase(job.fields.title) },
      }));
  
      setData((prevData) => [...prevData, ...updatedData]);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };

  const fetchCountry = async (country = '') => {
    setIsLoading(true);
  
    const params = {
      offset: 0,
      limit: 9,
      preset: 'latest',
      profile: 'list',
      fields: {
        include: ["career_categories.name", "source.shortname"]
      },
      filter: {
        field: 'country',
        value: country
      }
    };
  
    try {
      const response = await axios.get(`https://api.reliefweb.int/v1/jobs?appname=${username}`, { params });
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch country data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const jobsRequest = axios.post(
          `https://api.reliefweb.int/v1/jobs?appname=${username}`,
          {
            offset: 0,
            limit: 9,
            preset: "latest",
            profile: "list",
            fields: { include: ["career_categories.name", "source.shortname", "type.name"] },
          }
        );
  
        const countriesRequest = fetch(`https://api.reliefweb.int/v1/jobs?appname=${username}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "facets": [{ "field": "country.name", "limit": 500 }],
            "limit": 0
          })
        }).then(response => response.json());
  
        const [jobsResponse, countriesData] = await Promise.all([jobsRequest, countriesRequest]);
  
        const updatedData = jobsResponse.data.data.map((job) => ({
          ...job,
          fields: { ...job.fields, title: toTitleCase(job.fields.title) },
        }));
  
        setData(updatedData);
        setCountries(countriesData.embedded.facets['country.name'].data);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
  
    fetchInitialData();
  }, []);
  
    
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
            {/* End Job list */}

            <div className='flex w-full bg-gray-100 justify-center pb-8'>
                <button
                    onClick={loadMoreJobs}
                    disabled={isMoreLoading}
                    className='bg-rose-600 rounded border-2 border-rose-600 text-white px-8 py-2'>
                    {isMoreLoading ? 'Loading...' : 'Load More'}
                </button>
            </div>
          </div>
          
        )}

    </div>
  );
}

export default JobListingBoard;