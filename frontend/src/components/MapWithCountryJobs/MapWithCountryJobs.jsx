import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import geoUrl from "./features.json"
import countryCoordinates from './countryCoordinates';


function MapWithCountryJobs() {
  const username = 'aidify-user-' + uuidv4();
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Zoom and center state
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0,0]);

  // State for selected country popup
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
    const fetchCountryFacets = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.reliefweb.int/v1/jobs?appname=${username}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "facets": [{ "field": "country.name", "limit": 500 }],
            "limit": 0
          })
        });
        const data = await response.json();
        const facets = data.embedded.facets['country.name'].data;
        setCountries(facets);
      } catch (error) {
        console.error("Failed to fetch country data for the map:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountryFacets();
  }, []);

  // 1) Find the maximum job count for dynamic scaling
  const maxCount = useMemo(() => {
    if (countries.length === 0) return 0;
    return Math.max(...countries.map((c) => c.count || 0));
  }, [countries]);

  // 2) Define a scaling function for circle radius
  //    Here we map count=0 -> radius=5, count=maxCount -> radius=15
  const scaleMarkerSize = (count) => {
    const minRadius = 5;
    const maxRadius = 15;
    if (maxCount === 0) return minRadius; // avoid division by zero
    // Map the job count proportionally between minRadius and maxRadius
    return (
      ((count || 0) / maxCount) * (maxRadius - minRadius) + minRadius
    );
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 8)); // max zoom ~8
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 1)); // min zoom ~1
  };

  const handleMarkerClick = (value, count, coords) => {
    setSelectedMarker({ value, count, coords });
  };

  return (
    <div className=" bg-white relative">
      {isLoading ? (
        <p className='text-center mt-8 text-gray-700'>Loading map data...</p>
      ) : (
        <>
          {/* Zoom controls */}
          <div className='absolute top-4 left-4 z-10 flex flex-col space-y-2'>
            <button 
              onClick={handleZoomIn} 
              className='bg-white shadow-md w-10 h-10 rounded hover:bg-gray-300'
            >+</button>
            <button 
              onClick={handleZoomOut} 
              className='bg-white shadow-md w-10 h-10 rounded hover:bg-gray-300'
            >-</button>
          </div>

          <div className='w-full h-full'>
            <ComposableMap
              projection="geoMercator"
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup center={center} zoom={zoom}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map(geo => (
                      <Geography 
                        key={geo.rsmKey} 
                        geography={geo} 
                        fill="#EAEAEC" 
                        stroke="#D6D6DA"
                        style={{
                          default:  { outline: 'none' },
                          hover:    { outline: 'none' },
                          pressed:  { outline: 'none' }
                        }}
                      />
                    ))
                  }
                </Geographies>
                {countries.map((country) => {
                  const { value, count } = country;
                  const coords = countryCoordinates[value];

                  // Only render a marker if we have coordinates for this country
                  if (!coords) return null;

                  // 3) Calculate dynamic radius
                  const radius = scaleMarkerSize(count);

                  const isHovered = hoveredCountry === value;

                  return (
                    <Marker 
                      key={value} 
                      coordinates={coords}
                      onClick={() => handleMarkerClick(value, count, coords)}
                      onMouseEnter={() => setHoveredCountry(value)}
                      onMouseLeave={() => setHoveredCountry(null)}
                    >

                      <circle 
                      r={isHovered ? radius * 1.4 : radius}
                      fill={isHovered ? "#B5173A" : "#e11d48"}
                      stroke="#fff" 
                      strokeWidth={2} 
                      style={{ transition: "all 0.2s ease", cursor: "pointer" }}
                      />

                      <text
                        textAnchor="middle"
                        y={-10}
                        style={{ fontFamily: "system-ui", fill: "#333", fontSize: "10px" }}
                      >
                        {/* {value} ({count}) */}
                      </text>
                    </Marker>
                  );
                })}

                {/* Popup for selected marker */}
                {selectedMarker && (
                  <Marker coordinates={selectedMarker.coords}>
                    <foreignObject
                      x={-100}   // half of your max popup width
                      y={-80}    // push it up above the circle
                      width={200}
                      height={100}
                    >
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        className="
                          w-full h-full
                          p-4
                          bg-white
                          rounded-lg
                          shadow-lg
                          border border-gray-300
                          flex flex-col
                          items-center
                          justify-center
                          max-w-xs        /* never wider than ~20rem */
                          text-center
                          text-sm
                          break-words     /* wrap long country names */
                        "
                      >
                        {/* Title + count */}
                        <p className="font-semibold text-base leading-tight">
                          {selectedMarker.value}
                        </p>
                        <p className="text-neutral-500">{selectedMarker.count} jobs</p>
                        {/* Action link */}
                        <Link
                          to={`/job-details?country=${encodeURIComponent(selectedMarker.value)}`}
                          className="
                            mt-2
                            inline-block
                            bg-rose-600
                            hover:bg-rose-700
                            text-white
                            text-xs
                            px-3 py-1
                            rounded
                          "
                        >
                          View Jobs
                        </Link>
                      </div>
                    </foreignObject>

                    {/* now (0,0) is the circle’s center in screen‑space */}
                    {/* <g transform="translate(0, -20)">
                      <rect
                        x={-50}
                        y={-60}
                        width={200}
                        height={60}
                        rx={5}
                        ry={5}
                        fill="white"
                        stroke="#333"
                      />
                      <text
                        x={50}
                        y={-38}
                        textAnchor="middle"
                        style={{ fontFamily: 'system-ui', fontSize: '10px', fill: '#333' }}
                      >
                        {selectedMarker.value} ({selectedMarker.count})
                      </text>
                      <foreignObject x={0} y={-30} width={80} height={30}>
                        <div className="flex justify-center items-center h-full">
                          <Link
                            to={`/job-details?country=${encodeURIComponent(selectedMarker.value)}`}
                            className="bg-rose-600 text-white text-xs px-2 py-1 rounded hover:bg-rose-700"
                          >
                            View Jobs
                          </Link>
                        </div>
                      </foreignObject>
                    </g> */}
                  </Marker>
                )}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </>
      )}
    </div>
  );
}

export default MapWithCountryJobs;