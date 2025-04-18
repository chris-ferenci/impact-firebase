import React , {useState, useEffect} from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { useSearchParams } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';


import Header from "../components/Header/Header"
import JobListingBoard from "../components/JobListingBoard/JobListingBoard"
import countryFlags from '../data/countryFlags.json'

export default function JobBoard() {

    const username = 'aidify-user-' + uuidv4();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [selectedJobType, setSelectedJobType] = useState('');
    const [offset, setOffset] = useState(0); // New state variable for pagination offset
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(''); // This will store the clicked country

    const [searchParams] = useSearchParams();
    const countryParam = searchParams.get('country') || '';

      // when countryParam changes (or on mount), apply it:
    useEffect(() => {
        if (countryParam) {
        setSelectedCountry(countryParam);
        fetchCountry(countryParam);
        } else {
        // no country filter? fetch the first page
        fetchJobs();
        }
        // reset pagination, etc., if needed
    }, [countryParam]);


    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

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
    
    // Data

    const getCountryFlag = (countryName) => {
        return countryFlags[countryName] || ""; // This will return the flag emoji or an empty string if not found
    }

    const filteredJobs = data.filter(job => 
        job.fields.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!selectedCountry || (job.fields.country && job.fields.country[0].name === selectedCountry)) &&
        (!selectedJobType || (job.fields.type && job.fields.type[0].name === selectedJobType))
      );

    // Fetching jobs

    const fetchJobs = (filterField = '', value = '') => {
        let payload = {
            "offset": offset,
            "limit": 9,
            "preset": "latest",
            "profile": "list",
            "fields": {
                "include": ["career_categories.name", "source.shortname", "type.name"]
            }
        };

        if (filterField && value) {
            payload.filter = {
                "field": filterField,
                "value": value
            };
        }

        fetch(`https://api.reliefweb.int/v1/jobs?appname=${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            const updatedData = data.data.map(job => {
                job.fields.title = toTitleCase(job.fields.title);
                return job;
            });
            setData(updatedData);
            setOffset(prevOffset => prevOffset + 9);
            console.log(updatedData)
        });
        
    };

    const fetchCountry = (country = '') => {
        let payload = {
            "offset": 0,
            "limit": 9,
            "preset": "latest",
            "profile": "list",
            "fields": {
                "include": ["career_categories.name", "source.shortname"]
            }
        };
  
        if (country) {
            payload.filter = {
                "field": "country",
                "value": country
            };
        }
  
        fetch(`https://api.reliefweb.int/v1/jobs?appname=${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            setData(data.data);
      });
      };

      const fetchJobType = (jobType = '') => {

        let payload = {
            "facets": [
              {
                "field": "type.name"
              }
            ],
            "limit": 0
          }
  
        if (jobType) {
            payload.filter = {
                "field": "type.name",
                "value": jobType
            };
        }
  
        fetch(`https://api.reliefweb.int/v1/jobs?appname=${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            // setData(data.data);
            setJobTypes(data.embedded.facets['type.name'].data);
      });
      };


    useEffect(() => {

        fetchJobs();
        fetchJobType();

        // Fetching countries
        const countryPayload = {
            "facets": [
                {
                    "field": "country.name",
                    "limit": 500
                }
            ],
            "limit": 0
          };
          
          fetch(`https://api.reliefweb.int/v1/jobs?appname=${username}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(countryPayload)
          })
          .then(response => response.json())
          .then(data => {
              setCountries(data.embedded.facets['country.name'].data);
          });

          // Add event listener for scroll
        window.addEventListener('scroll', checkScrollBottom);

        // Cleanup the event listener on unmount
        return () => window.removeEventListener('scroll', checkScrollBottom);

    }, []);


    // Handlers
    const handleJobTypeSelect = (jobType) => {
        setSelectedJobType(jobType);
        fetchJobType(jobType);
    }
    const checkScrollBottom = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        fetchJobs();
    }


    return(
        <div className="app w-full">
        <Header />
     
        <JobListingBoard 
        onSelectCountry={handleCountrySelect}
        countries={countries}
        filteredJobs={filteredJobs}
        getCountryFlag={getCountryFlag}
        jobTypes={jobTypes}
        onSelectJobType={handleJobTypeSelect}
        isLoading={isLoading}
        maxCountries={5}
        handleCountrySelect={handleCountrySelect}
        />
               
        </div>

    )
}