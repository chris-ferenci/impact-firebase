import React from 'react';

function CountryList({ countries, onSelectCountry, getCountryFlag, maxCountries }) {
    return (
        <div>
            {/* <h3 className='text-lg mb-4 font-semibold text-left'>Trending Regions</h3> */}
            <ul className="list-none flex flex-wrap">
                {countries.slice(0, maxCountries).map(country => (
                    <li className="mr-2 mb-2 mt-2" key={country.value}>
                        <button className='rounded font-medium bg-gray-100 border-t-0 border-l-0 border-r-0 border-b-0 hover:border-b-2 hover:border-neutral-900 text-neutral-900 py-2 px-4' href="#" onClick={e => {
                            e.preventDefault();
                            onSelectCountry(country.value);
                        }}>
                            <div className='flex flex-row gap-2'>{getCountryFlag(country.value)}<p>{country.value}</p></div>
                            {/* ({country.count}) */}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CountryList;