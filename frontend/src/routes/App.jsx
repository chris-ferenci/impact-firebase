import React, { useState, useEffect, useMemo } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

const cascadeVariant = {
hidden: { opacity: 0, y: 20 },
visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
    delay: i * 0.2,
    duration: 0.6,
    ease: 'easeOut',
    },
}),
};


function App() {
    const helmetContext = {};

    const [selectedCountry, setSelectedCountry] = useState(''); // Lift state up here
    const [countries, setCountries] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);

    // Data

    const getCountryFlag = (countryName) => {
        return countryFlags[countryName] || ""; // This will return the flag emoji or an empty string if not found
    }

    // Handlers

    const handleCountrySelect = (country) => {
      setSelectedCountry(country);
    };

    // const handleJobTypeSelect = (jobType) => {
    //     setSelectedJobType(jobType);
    //     fetchJobType(jobType);
    // }

    return (
    <HelmetProvider context={helmetContext}>
      <div className="w-full bg-gray-100 text-neutral-900">
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

                <motion.div 
                initial="hidden"
                animate="visible"
                className="w-full md:w-1/2 flex flex-col flex-wrap px-8 py-8 md:px-16 md:py-16"
                >
                    <motion.h1 
                    className='text-5xl md:text-6xl text-left font-bold mb-8 leading-tighter tracking-tight'
                    custom={1}
                    variants={cascadeVariant}
                    >
                        Make your <span className='text-rose-600'>Impact</span>
                    </motion.h1>

                    <motion.h2 
                    className='text-2xl text-left font-regular mb-8 leading-tight'
                    custom={2}
                    variants={cascadeVariant}
                    >
                        Explore leading job and volunteer opportunities in health, climate sustainability, and international development.

                    </motion.h2>
                    
                    <motion.p 
                    className='text-neutral-800 font-bold'
                    custom={3}
                    variants={cascadeVariant}
                    >
                        Opportunities Around the Globe
                    </motion.p>
                    
                    <motion.div custom={4} variants={cascadeVariant}>
                        <CountryList 
                        countries={countries}
                        onSelectCountry={handleCountrySelect}
                        getCountryFlag={getCountryFlag} 
                        maxCountries={6}
                        showMoreButton={false}
                        justify='start'
                        />
                    </motion.div>

                    <motion.div className='flex mt-4' custom={5} variants={cascadeVariant}>
                        <Link to='/jobs'>
                            <button className='bg-rose-600 hover:bg-rose-800 rounded  text-white px-4 py-2'>Browse All Opportunities</button>
                        </Link>
                    </motion.div>

                </motion.div>

                <div className='hidden sm:block md:w-1/2 bg-gray-100'>
                    <img className="overflow-x-hidden" src={heroImg} alt="hero-img" style={{objectFit: "cover", height:"100%", width:"auto"}} />
                </div>

            </div>

            {/* <div className='flex flex-row w-full bg-neutral-900 px-4 py-4 justify-center'>
                <Search  />
            </div> */}


            {/* JOB LIST */}
            
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            >
                <JobListingBoard
                selectedCountry={selectedCountry} // Pass selectedCountry down
                getCountryFlag={getCountryFlag}
                handleCountrySelect={handleCountrySelect}
                />
            </motion.div>
        

        </div>

        

        </div>

    </HelmetProvider>
    );
}

export default App;
