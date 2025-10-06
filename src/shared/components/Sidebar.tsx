import React, { useEffect, useState } from "react";
import { useSuggestions } from "../hooks/useSuggestions";
import { useMap } from "../hooks/useMap";
import { formatRouteData } from "../Utils";
import useAuth from "../hooks/useAuth";
import DeliveryTrackingDetails from "../../modules/Home/Components/DeliveryTrackingDetails";

const LocationPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.42-.25.698-.453l.028-.022c.283-.226.568-.46.837-.708l.01-.009.019-.016a1 1 0 00.004-.99c-.004-.005-.008-.009-.013-.014a10.042 10.042 0 00-1.284-1.342A8.042 8.042 0 0110 2a8.042 8.042 0 014.228 11.087 10.042 10.042 0 00-1.283 1.342 1 1 0 00-.013.014.996.996 0 00.004.99l.019.016.01.009c.27.248.554.482.837.708l.028.022c.278.203.512.354.698.453a5.741 5.741 0 00.281.14l.018.008.006.003.002.001s.11.02.308.066l.003-.001z" clipRule="evenodd" />
    <path d="M10 8a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Sidebar: React.FC = () => {
  type FieldType = "origin" | "destination";

  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [activeField, setActiveField] = useState<FieldType | null>(null);
  const [routeData, setRouteData] = useState<{ distance: string, duration: string } | null>(null)

  const { setOrigin, setDestination, origin, destination, routeInfo } = useMap()
  const { role } = useAuth()

  const activeSearchTerm = activeField === "origin" ? originInput : destinationInput;
  const { suggestions, isLoading } = useSuggestions(activeSearchTerm);

  const handleChange = (value: string, field: FieldType) => {
    setActiveField(field);
    if (field === "origin") setOriginInput(value);
    else setDestinationInput(value);
  };

  const handleSelect = (value: string) => {
    if (activeField === "origin") setOriginInput(value);
    else setDestinationInput(value);
  };

  const handleFindRoute = () => {
    if(routeData) setRouteData(null)
    if (originInput.trim()) {
      setOrigin(originInput.trim());
    }
    if (destinationInput.trim()) {
      setDestination(destinationInput.trim());
    }
  };

  useEffect(() => {
    if(origin && destination && routeInfo) {
      const { distance, duration } = formatRouteData(routeInfo?.distance, routeInfo.duration)
      setRouteData({ distance, duration })
    }
  },[routeInfo])

  if(role === 'user') return <DeliveryTrackingDetails />

  return (
    <div className="w-96 bg-white shadow-2xl rounded-2xl p-6 font-sans flex flex-col h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Route Planner</h1>

      <div className="space-y-5 flex-grow">
        <div className="relative">
          <label className="font-semibold text-gray-600 text-sm mb-1 block">Pickup Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LocationPinIcon />
            </div>
            <input
              type="text"
              value={originInput}
              onChange={(e) => handleChange(e.target.value, "origin")}
              placeholder="Enter a starting point"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="relative">
          <label className="font-semibold text-gray-600 text-sm mb-1 block">Drop-off Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LocationPinIcon />
            </div>
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => handleChange(e.target.value, "destination")}
              placeholder="Enter a destination"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        
        <div className="relative">
          {isLoading && (
            <div className="flex items-center justify-center p-4 text-gray-500">
              <SpinnerIcon />
              <span className="ml-2">Searching...</span>
            </div>
          )}
          {activeField && suggestions.length > 0 && !isLoading && (
            <ul className="absolute w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
              {suggestions.map((s, i) => (
                <li 
                  key={i}
                  onClick={() => handleSelect(s)}
                  className="px-4 py-2.5 cursor-pointer hover:bg-blue-50 text-gray-700 transition-colors"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {origin && destination && routeInfo && <div className="space-y-1 border border-gray-200 rounded-md p-2">
        <strong className="text-base">Route Info:</strong>
        <div className="flex flex-col">
          <p className="text-base"><strong>Distance:</strong> {routeData?.distance}</p>
          <p className="text-base"><strong>Estimated Time:</strong> {routeData?.duration}</p>
        </div>
      </div>}
      
      {/* Action Button */}
      <div className="mt-6">
        <button onClick={handleFindRoute} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
          Find Route
        </button>
      </div>
    </div>
  );
};

export default Sidebar;