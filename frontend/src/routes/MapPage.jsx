import React from 'react';
import MapWithCountryJobs from '../components/MapWithCountryJobs/MapWithCountryJobs';
import Header from '../components/Header/Header';

function MapPage() {
    return (
        <div className='flex flex-col w-full'>
            <Header />
            <MapWithCountryJobs />
        </div>
    );
}

export default MapPage;