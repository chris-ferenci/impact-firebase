import React, {useState, useEffect} from 'react';

import { v4 as uuidv4 } from 'uuid';

function CountryList({ onSelectCountry, getCountryFlag, maxCountries }) {

    const username = 'aidify-user-' + uuidv4();

    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [visibleCountryCount, setVisibleCountryCount] = useState(5);
  
    // Handlers

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    // Call the callback passed from JobListingBoard
    if (onSelectCountry) onSelectCountry(country);
  };

  const handleShowMoreCountries = () => {
    setVisibleCountryCount(prevCount => prevCount + 5);
  };

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
      } catch (error) {
        console.error("Failed to fetch initial country data:", error);
      }
    };
  
    fetchInitialCountryData();
  }, []);


    return (
        <div>
            <ul className="list-none flex flex-wrap">
                {countries.slice(0, maxCountries).map(country => (
                    <li className="mr-2 mb-2 mt-2" key={country.value}>
                        <button className='rounded shadow-md shadow-neutral-500/10 font-medium bg-white border-t-0 border-l-0 border-r-0 border-b-0 hover:border-b-2 hover:border-neutral-900 text-neutral-900 py-2 px-4' href="#" 
                        onClick={e => {
                            e.preventDefault();
                            handleCountrySelect(country.value);
                        }}>
                            <div className='flex flex-row gap-2'>{getCountryFlag(country.value)}<p>{country.value}</p></div>
                        </button>
                    </li>
                ))}
            </ul>

            {visibleCountryCount < countries.length && (
          <button 
            onClick={handleShowMoreCountries} 
            className='mt-4 bg-rose-600 text-white px-4 py-2 rounded-md'
          >
            Show More Countries
          </button>
        )}
        </div>
    );
}

export default CountryList;