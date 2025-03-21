import React, { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

import '../App.css';

import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import JobCard from '../components/JobCard/JobCard';
import JobDetails from '../components/JobDetails/JobDetails';
import CountryList from '../components/CountryList/CountryList';
import CategoryList from '../components/CategoryList/CategoryList';
import heroImg from '../assets/img/hero-img-1.jpg';
import JobDetailsPage from './JobDetailsPage';
import countryFlags from '../data/countryFlags.json'
import JobListingBoard from '../components/JobListingBoard/JobListingBoard';

import ReactGA from "react-ga4";
const TRACKING_ID = "G-9LT7BKNPSS"; // OUR_TRACKING_ID
  ReactGA.initialize(TRACKING_ID);


function App() {
    const helmetContext = {};
    const username = 'aidify-user-' + uuidv4();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [selectedJobType, setSelectedJobType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCountry, setFilterCountry] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(''); // This will store the clicked country
    const [selectedCategory, setSelectedCategory] = useState('');

    const [offset, setOffset] = useState(0); // New state variable for pagination offset

    //Utilities
    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      };
    
    // Data

    const getCountryFlag = (countryName) => {
        return countryFlags[countryName] || ""; // This will return the flag emoji or an empty string if not found
    }

    // Handlers

    const handleCountrySelect = (country) => {
      setSelectedCountry(country);
      fetchCountry(country);
    };

    const handleJobTypeSelect = (jobType) => {
        setSelectedJobType(jobType);
        fetchJobType(jobType);
    }

    // const handleCategorySelect = (category) => {
    //     setSelectedCategory(category);
    //     fetchJobs(category);
    // };

    const filteredJobs = data.filter(job => 
      job.fields.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCountry || (job.fields.country && job.fields.country[0].name === selectedCountry)) &&
      (!selectedJobType || (job.fields.type && job.fields.type[0].name === selectedJobType))
    );

    const loadMoreJobs = () => {
        setOffset(prevOffset => {
            const newOffset = prevOffset + 9;
            setIsMoreLoading(true); // Set loading more to true
            fetchJobs(newOffset, true); // Pass newOffset directly to the fetch function
            return newOffset;
        });
    };

    // Fetching jobs

    const fetchJobs = async (newOffset = offset, isMore = false) => {

        if (!isMore) setIsLoading(true);
        else setIsMoreLoading(true);
        
        const startTime = Date.now();

        const payload = {
            "offset": newOffset,
            "limit": 9,
            "preset": "latest",
            "profile": "list",
            "fields": {
                "include": ["career_categories.name", "source.shortname", "type.name"]
            }
        };

        try {
            const response = await axios.post(`https://api.reliefweb.int/v1/jobs?appname=${username}`, payload);
            const updatedData = response.data.data.map(job => ({
                ...job,
                fields: {
                    ...job.fields,
                    title: toTitleCase(job.fields.title)
                }
            }));
            setData(prevData => [...prevData, ...updatedData]);

            const delay = 1500 - (Date.now() - startTime);
            setTimeout(() => {
                if (!isMore) setIsLoading(false);
                else setIsMoreLoading(false);
            }, delay > 0 ? delay : 0);

        } catch (error) {
            console.error("Failed to fetch jobs:", error);
            if (!isMore) setIsLoading(false);
            else setIsMoreLoading(false);
        }
        
    };

    const fetchCountry = async (country = '') => {

        setIsLoading(true);
        const startTime = Date.now();

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

            const delay = 1500 - (Date.now() - startTime);
            setTimeout(() => {
                setData(response.data.data);  // Assume data is in response.data.data
                setIsLoading(false);
            }, delay > 0 ? delay : 0);
            
        } catch (error) {
            console.error("Failed to fetch country data:", error);
            setIsLoading(false);
        }
      };

      const fetchJobType = async (jobType = '') => {
        const params = {
            facets: [
                {
                    field: "type.name"
                }
            ],
            limit: 0,
            filter: {
                field: 'type.name',
                value: jobType
            }
        };

        try {
            const response = await axios.get(`https://api.reliefweb.int/v1/jobs?appname=${username}`, { params });
            setJobTypes(response.data.embedded.facets['type.name'].data);
        } catch (error) {
            console.error("Failed to fetch job types:", error);
        }
    };


    useEffect(() => {
        fetchJobs();
        // Fetching countries
        fetch(`https://api.reliefweb.int/v1/jobs?appname=${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "facets": [
                    {
                        "field": "country.name",
                        "limit": 500
                    }
                ],
                "limit": 0
            })
        })
        .then(response => response.json())
        .then(data => {
            setCountries(data.embedded.facets['country.name'].data);
        });
    }, []);

    return (
    <HelmetProvider context={helmetContext}>

      <div className="app text-neutral-900">
        <Helmet>
            <title>ImpactCareers | Careers & Volunteering in Health, Climate, International Development</title>
            <meta name="description" content="Discover a diverse range of career, job, and volunteer opportunities in the health, climate change, and international development sectors. Connect with impactful positions globally and advance your career while contributing to significant causes. Explore our updated listings to find roles that match your skills and passions." />
            {/* Open Graph */}
            <meta property="og:title" content="Global Opportunities Board | Careers & Volunteering in Health, Climate, International Development" />
            <meta property="og:description" content="Join our platform to find the latest career and volunteering opportunities in health, climate action, and international development. Empower your career journey with roles that make a difference globally. Browse now to start your path towards impactful work." />
            <meta property="og:url" content="http://www.impactcareers.netlify.com/" />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="http://www.yoursite.com/path-to-your-image.jpg" />
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Global Opportunities Board | Careers & Volunteering in Health, Climate, International Development" />
            <meta name="twitter:description" content="Explore leading job and volunteer opportunities in health, climate sustainability, and international development. Join our community to make a global impact through your work. Check out the latest positions today." />
            <meta name="twitter:image" content="http://www.yoursite.com/path-to-your-twitter-image.jpg" />
        </Helmet>

        <Header />

        <div>
            <div className='flex flex-col md:flex-row w-full bg-white'>

                <div className="w-full md:w-1/2 flex flex-col px-16 py-16">
                    <h1 className='text-6xl text-left font-bold mb-8 leading-tighter tracking-tight'>Work opportunities that <span className='text-rose-600'>make an impact</span></h1>
                    <h2 className='text-2xl text-left font-regular mb-8 leading-tight'>Explore leading job and volunteer opportunities in health, climate sustainability, and international development.</h2>
                    
                    {/* <CategoryList categories={categories} onSelectCategory={handleCategorySelect} /> */}

                    <CountryList countries={countries} onSelectCountry={handleCountrySelect} getCountryFlag={getCountryFlag} maxCountries={6}/>
                </div>

                <div className='hidden sm:block md:w-1/2 bg-gray-100'>
                    <img className="overflow-x-hidden" src={heroImg} alt="hero-img" style={{objectFit: "cover", height:"100%", width:"auto"}} />
                </div>

            </div>

            <div className='flex flex-row w-full bg-neutral-900 px-4 py-4 justify-center'>
                {/* <CountryList countries={countries} onSelectCountry={handleCountrySelect} getCountryFlag={getCountryFlag}/> */}
                <Search  />
            </div>


            {/* JOB LIST */}

            <div className='flex flex-col w-full bg-gray-50 pt-8 px-16'>

                <h2 className='text-center text-2xl text-gray-900 font-bold'>Latest Jobs Around the World</h2>

                <p className='text-center text-lg mb-4'>Browse the latest opportunities from around the globe</p>
                
                <div className='flex justify-center'>
                    <CountryList 
                        countries={countries} 
                        onSelectCountry={handleCountrySelect} 
                        getCountryFlag={getCountryFlag} 
                        maxCountries={15}
                    />
                </div>
                <Link className='text-center mt-4 text-rose-600' to="/jobs">View All Countries</Link>
            </div>


            <JobListingBoard 
            filteredJobs={filteredJobs}
            getCountryFlag={getCountryFlag}
            jobTypes={jobTypes}
            onSelectJobType={handleJobTypeSelect}
            isLoading={isLoading}
            />

            {/* End Job list */}
        

        </div>

        <div className='flex w-full bg-gray-50 justify-center pb-8'>
            <button
                onClick={loadMoreJobs}
                disabled={isMoreLoading}
                className='bg-rose-600 rounded border-2 border-rose-600 text-white px-8 py-2'>
                {isMoreLoading ? 'Loading...' : 'Load More'}
            </button>
        </div>

        </div>

    </HelmetProvider>
    );
}

export default App;
