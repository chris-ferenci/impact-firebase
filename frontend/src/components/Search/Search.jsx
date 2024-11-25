import React, { useState } from 'react';

function Search({ onSearch, countries }) {

    const [term, setTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');

    // const handleSearch = () => {
    //     onSearch(term, selectedCountry);
    // };

    const handleSearch = () => {
        onSearch(term);
    };

    return (
        <div className="search-container">
            <h2 className='text-white text-2xl font-bold text-center mb-2'>Coming soon: Impact Newsletter</h2>
            <h3 className='text-white text-lg font-regular mb-4 text-center'>Sign up to recieve weekly email updates of recently posted opportunities and the latest in humanitarian news</h3>
            <div className="flex flex-row gap-4 relative search-bar">
                
                <input
                    className="rounded w-3/4 text-md bg-white border border-gray-400 px-4 py-2 text-neutral-900"
                    type="text"
                    placeholder="Email Address"
                    value={term}
                    onChange={e => setTerm(e.target.value)}
                />
             
                <button className='rounded w-1/4 text-md font-medium bg-rose-600 text-white px-2 py-2' onClick={handleSearch}>Sign Up</button>
            </div>

            {/* <div className="filter-container"> */}
                {/* <h3 className='text-sm font-bold text-left'>Filters</h3> */}
                {/* <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
                        <option value="">All Countries</option>
                        {countries.map(country => (
                            <option key={country.value} value={country.value}>
                                {country.value}
                            </option>
                        ))}
                </select> */}
            {/* </div> */}
        </div>

);   
}

export default Search;