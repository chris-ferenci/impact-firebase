import React , {useState, useEffect} from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { useSearchParams } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';


import Header from "../components/Header/Header"
import JobListingBoard from "../components/JobListingBoard/JobListingBoard"
import countryFlags from '../data/countryFlags.json'

export default function JobBoard() {

    
    const [selectedCountry, setSelectedCountry] = useState(''); // This will store the clicked country

    const navigate = useNavigate();

    //   // Handlers

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        fetchCountry(country);
      };
    
    // Data

    const getCountryFlag = (countryName) => {
        return countryFlags[countryName] || ""; // This will return the flag emoji or an empty string if not found
    }


    return(
        <div className="app w-full">
        <Header />
     
        <JobListingBoard 
        selectedCountry={selectedCountry}  
        getCountryFlag={getCountryFlag}
        handleCountrySelect={handleCountrySelect}
        />
               
        </div>

    )
}