import React, {useState, useEffect} from 'react';

import { v4 as uuidv4 } from 'uuid';

function CountryList({ onSelectCountry, getCountryFlag, maxCountries }) {

    const username = 'aidify-user-' + uuidv4();

    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [visibleCountryCount, setVisibleCountryCount] = useState(5);

    const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    if (onSelectCountry) onSelectCountry(country);
    };

    const handleShowMoreCountries = () => {
    setVisibleCountryCount(prevCount => Math.min(prevCount + 5, countries.length));
    };

    const handleShowAllJobs = () => {
        handleCountrySelect('');
    }

    useEffect(() => {
        const fetchInitialCountryData = async () => {
        try {
            const countriesRequest = fetch(`https://api.reliefweb.int/v1/jobs?appname=${username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "facets": [{ "field": "country.name", "limit": 500 }],
                "limit": 0
            })
            }).then(response => response.json());
    
            const countriesData = await countriesRequest;
            setCountries(countriesData.embedded.facets['country.name'].data);

            setVisibleCountryCount((prev) => Math.min(prev, countriesData.embedded.facets['country.name'].data.length))
        } catch (error) {
            console.error("Failed to fetch initial country data:", error);
        }
        };
    
        fetchInitialCountryData();
    }, []);

    const isAllJobsActive = selectedCountry === '';

    return (
        <div>
            <ul className="list-none flex flex-wrap gap-2">

                {/* "All Jobs" button to remove country filter */}
                <li className='mb-2 mt-2'>
                <button
                    className={`rounded shadow-md shadow-neutral-500/10 font-medium bg-white border-t-0 border-l-0 border-r-0 border-b-0 hover:border-b-2 hover:border-neutral-900 text-neutral-900 py-2 px-4 ${isAllJobsActive ? 'bg-rose-100 border-b-2 border-rose-600' : ''}`}
                    onClick={e => {
                    e.preventDefault();
                    handleShowAllJobs();
                    }}
                >
                    <span className="text-sm">🌍</span> All Countries
                </button>
                </li>
                
                {countries.slice(0, visibleCountryCount).map(country => {
                    const isActive = country.value === selectedCountry;
                    return (
                        
                        <li className='mb-2 mt-2' key={country.value}>
                            
                            {/* All other country buttons */}
                            <button
                                className={`rounded shadow-md shadow-neutral-500/10 font-medium bg-white border-t-0 border-l-0 border-r-0 border-b-0 hover:border-b-2 hover:border-neutral-900 text-neutral-900 py-2 px-4 ${isActive ? 'bg-rose-100 border-b-2 border-rose-600' : ''}`} 
                                onClick={e => {
                                e.preventDefault();
                                handleCountrySelect(country.value);
                                }}
                            >
                                <div className='flex flex-row gap-2 items-center'>
                                {getCountryFlag(country.value)}
                                <p>{country.value}</p>
                                {typeof country.count === 'number' && (
                                    <span className="text-sm text-gray-500">({country.count})</span>
                                )}
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className='flex gap-4 mt-4'>
                {/* Show "Show More Countries" button only if there are more countries to show */}
                {visibleCountryCount < countries.length && (
                <button 
                    onClick={handleShowMoreCountries} 
                    className='bg-rose-600 text-white px-4 py-2 rounded-md'
                >
                    Show More Countries
                </button>
                )}

                
            </div>
        </div>
    );
}

export default CountryList;