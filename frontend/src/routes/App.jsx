import React, { useState, useEffect, useMemo } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

import '../App.css';

import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import CountryList from '../components/CountryList/CountryList';
import heroImg from '../assets/img/hero-img-1.jpg';
import countryFlags from '../data/countryFlags.json'
import JobListingBoard from '../components/JobListingBoard/JobListingBoard';

import ReactGA from "react-ga4";
const TRACKING_ID = "G-9LT7BKNPSS"; // OUR_TRACKING_ID
  ReactGA.initialize(TRACKING_ID);


function App() {
    const helmetContext = {};
    const username = 'aidify-user-' + uuidv4();

    const [countries, setCountries] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);

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

    return (
    <HelmetProvider context={helmetContext}>

      <div className="app w-full text-neutral-900">
        <Helmet>
            <title>ImpactCareers | Opportunities in Health, Climate, International Development</title>
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

                <div className="w-full md:w-1/2 flex flex-col flex-wrap px-8 py-8 md:px-16 md:py-16">
                    <h1 className='text-5xl md:text-6xl text-left font-bold mb-8 leading-tighter tracking-tight'>Make your <span className='text-rose-600'>Impact</span></h1>
                    <h2 className='text-2xl text-left font-regular mb-8 leading-tight'>Explore leading job and volunteer opportunities in health, climate sustainability, and international development.</h2>
                    
                    <p className='text-neutral-800 font-bold'>Browse Latest Regions</p>
                    <CountryList countries={countries} onSelectCountry={handleCountrySelect} getCountryFlag={getCountryFlag} maxCountries={6}/>
                </div>

                <div className='hidden sm:block md:w-1/2 bg-gray-100'>
                    <img className="overflow-x-hidden" src={heroImg} alt="hero-img" style={{objectFit: "cover", height:"100%", width:"auto"}} />
                </div>

            </div>

            <div className='flex flex-row w-full bg-neutral-900 px-4 py-4 justify-center'>
                <Search  />
            </div>


            {/* JOB LIST */}

            <div className='flex flex-col w-full bg-neutral-100 pt-8 px-8 md:px-16'>

                <h2 className='text-center text-2xl text-gray-900 font-bold'>Latest Opportunities Around the World</h2>

                <p className='text-center text-lg mb-4'>Browse the latest from around the globe</p>
                
            </div>

            <JobListingBoard 
            onSelectCountry={handleCountrySelect}
            countries={countries}
            // filteredJobs={filteredJobs}
            getCountryFlag={getCountryFlag}
            jobTypes={jobTypes}
            onSelectJobType={handleJobTypeSelect}
            // isLoading={isLoading}
            maxCountries={5}
            handleCountrySelect={handleCountrySelect}
            />

        

        </div>

        

        </div>

    </HelmetProvider>
    );
}

export default App;
