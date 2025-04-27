import React from 'react';
import MapWithCountryJobs from '../components/MapWithCountryJobs/MapWithCountryJobs';
import Header from '../components/Header/Header';

function MapPage() {
    return (
        <div className='flex flex-col w-screen text-neutral-900 bg-gray-100'>
            <Header />
            <div className="container mx-auto mt-10 px-4 ">
                <div className='w-full h-full container mx-auto bg-white rounded-lg p-8'>
                    <h1 className="text-3xl font-bold text-center mb-2">Opportunities Map</h1>
                    <p className="text-center text-gray-600 mb-6">This map displays the distribution of jobs in different countries.</p>

                     {/* Constrain width & center */}
                    <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-300 p-4 ">
                        <MapWithCountryJobs />
                    </div>

                     {/* Caption or description under the map */}
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Data is pulled live from ReliefWeb and is updated daily.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MapPage;