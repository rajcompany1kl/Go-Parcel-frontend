import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useSuggestions } from "../hooks/useSuggestions";
import { useMap } from "../hooks/useMap";
import { formatRouteData, getEstimatedDeliveryDate } from "../Utils";
import useAuth from "../hooks/useAuth";
import DeliveryTrackingDetails from "../../modules/Home/Components/DeliveryTrackingDetails";
import HomeFactory from "../../modules/Home/factory";
import useService from "../hooks/useServices";
import { LocationPinIcon, SpinnerIcon } from "./ui/Icons";
import DriverSidebar from "../../modules/Home/Components/DriverSidebar";

const Sidebar: React.FC<{ 
  isSidebarOpen: boolean, 
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>> 
}> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  type FieldType = "origin" | "destination";

  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [activeField, setActiveField] = useState<FieldType | null>(null);
  const [routeData, setRouteData] = useState<{ distance: string, duration: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(false) 

  const { setOrigin, setDestination, origin, destination, routeInfo, geocodeAddress } = useMap()
  const { role, user } = useAuth()
  const services = useService()

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
    setLoading(true)
    if(routeData) setRouteData(null)
    if (originInput.trim()) {
      setOrigin(originInput.trim());
    }
    if (destinationInput.trim()) {
      setDestination(destinationInput.trim());
    }
  };

  async function createDelivery(
    originCoords: [number, number], 
    destinationCoords: [number, number]
  ) {
    if(routeInfo) {
      const deliveryPayload = HomeFactory.createRide({
            adminId: user?.id as string,
            distance: routeInfo.distance.toString(),
            end_location: { lat: destinationCoords[0], lng: destinationCoords[1] },
            start_location: { lat: originCoords[0], lng: originCoords[1] },
            startAddress: originInput,
            endAddress: destinationInput,
            initialDriverLocation: { lat: originCoords[0], lng: originCoords[1] }
          });
      const response = await services.home.createDelivery(deliveryPayload)
      setLoading(false)
      setDestinationInput("")
      setOriginInput("")
      if(isSidebarOpen) setIsSidebarOpen(false)
      if(response.data) {
        console.log(response.data)
      }
    }
  }

  const getCoordinates = async() => {
    const originCoordinates = await geocodeAddress(origin)
    const destinationCoordinates = await geocodeAddress(destination)
    if(originCoordinates && destinationCoordinates) {
      createDelivery(originCoordinates, destinationCoordinates)
    }
  }

  useEffect(() => {
    if(origin && destination && routeInfo && role !== 'user') {
      const { distance } = formatRouteData(routeInfo?.distance, routeInfo.duration)
      const duration = getEstimatedDeliveryDate(routeInfo.duration)
      setRouteData({ distance, duration })
      getCoordinates();
    }
  },[routeInfo])

  if (role === 'user') return <DeliveryTrackingDetails />;
  if (role === 'driver') return <DriverSidebar />;

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

      {origin && destination && routeInfo && <div className="space-y-1 bg-slate-50 shadow-lg rounded-md p-2">
        <div className="flex flex-col">
          <p className="text-base"><strong>Distance:</strong> {routeData?.distance}</p>
          <p className="text-base"><strong>ETA:</strong> {routeData?.duration}</p>
        </div>
      </div>}
      
      <div className="mt-6">
        <button onClick={handleFindRoute} className="w-full text-white font-bold py-3 px-4 rounded-lg bg-neutral-800 transition-all duration-300 transform hover:ring-2 ring-neutral-800 ring-offset-2">
          {!loading ? 'Create Delivery' : 'Creating delivery...'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;