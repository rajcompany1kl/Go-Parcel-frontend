import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useSuggestions } from "../hooks/useSuggestions";
import { useMap } from "../hooks/useMap";
import { formatRouteData, getEstimatedDeliveryDate } from "../Utils";
import useAuth from "../hooks/useAuth";
import DeliveryTrackingDetails from "../../modules/Home/Components/DeliveryTrackingDetails";
import useService from "../hooks/useServices";
import { LocationPinIcon, SpinnerIcon } from "./ui/Icons";
import DriverSidebar from "../../modules/Home/Components/DriverSidebar";
import type { DriverUserAccount } from "../types";
import * as AuthFactory from '../../modules/Auth/factory'
import HomeFactory from "../../modules/Home/factory";
import { useToaster } from "../hooks/useToast";

const Sidebar: React.FC<{ 
  isSidebarOpen: boolean, 
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>> 
}> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  type FieldType = "origin" | "destination" | "drivers";

  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [activeField, setActiveField] = useState<FieldType | null>('origin');
  const [routeData, setRouteData] = useState<{ distance: string, duration: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(false) 
  const [availableDrivers, setAvailableDrivers] = useState<AuthFactory.MongoDriverUserDocument[]>([])
  const [selectedDriver, setSelectedDriver] = useState<AuthFactory.MongoDriverUserDocument | null>(null)

  const { origin, destination, routeInfo, setOriginCoords, setDestinationCoords, originCoords, destinationCoords } = useMap()
  const { role, user } = useAuth()
  const { addToast } = useToaster()
  const services = useService(addToast)

  const activeSearchTerm = activeField === "origin" ? originInput : destinationInput;
  const { suggestions, isLoading } = useSuggestions(activeSearchTerm);

  const handleChange = (value: string, field: FieldType) => {
    setActiveField(field);
    if (field === "origin") setOriginInput(value);
    else setDestinationInput(value);
  };

  const handleSelect = (place: { lat: number, lng: number, address: string }) => {
    if (activeField === "origin") setOriginCoords([place.lat,place.lng])
    else if(activeField === 'destination') setDestinationCoords([place.lat,place.lng])
  };

  async function createDelivery() {
    if(!selectedDriver && !originInput && !destinationInput) {
      addToast('Origin, Destination and Driver Selection is necessary to create a delivery!','error',2000)
    }
    setLoading(true)
    if(selectedDriver) {
      const driver = AuthFactory.createDriverUserAccount(selectedDriver)
      if(routeInfo && originCoords && destinationCoords) {
        const deliveryPayload = HomeFactory.createRide({
              adminId: user?.id as string,
              driverId: driver?.id as string,
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
        if(response.data) addToast("Delivery created successfully!")
      }
    }
  }

  async function fetchAvailableDrivers() {
    const response = await services.home.getAvailableDrivers()
    if(response.data) setAvailableDrivers(response.data as AuthFactory.MongoDriverUserDocument[])
  }

  useEffect(() => {
    if(originCoords && destinationCoords && routeInfo && role !== 'user') {
      const { distance } = formatRouteData(routeInfo?.distance, routeInfo.duration)
      const duration = getEstimatedDeliveryDate(routeInfo.duration)
      setRouteData({ distance, duration })
    }
    if(role === 'admin') fetchAvailableDrivers()
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

        <div className="flex justify-start items-center space-x-4">
          {selectedDriver ? <p className="text-xl text-gray-600 tracking-wide font-bold">Selected Driver</p> : <button className="w-fit text-white font-medium py-1.5 px-2 rounded-lg bg-neutral-800" onClick={() => setActiveField('drivers')}>Select Driver</button>}
          {selectedDriver && <p className="text-xl text-gray-600 tracking-wide font-light">{selectedDriver.firstName} {selectedDriver.lastName}</p>}
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
              {activeField !== 'drivers' ? suggestions.map((place, i) => (
                <li 
                  key={i}
                  onClick={() => handleSelect(place)}
                  className="px-4 py-2.5 cursor-pointer hover:bg-blue-50 text-gray-700 transition-colors"
                >
                  {place.address}
                </li>
              )) : availableDrivers.map((driver,i) => (
                <li 
                  key={i}
                  onClick={() => {
                    setSelectedDriver(driver)
                    setActiveField(null)
                  }}
                  className="px-4 py-2.5 cursor-pointer hover:bg-blue-50 text-gray-700 transition-colors"
                >
                  {driver.firstName} {driver.lastName}
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
        <button onClick={createDelivery} className="w-full text-white font-bold py-3 px-4 rounded-lg bg-neutral-800 transition-all duration-300 transform hover:ring-2 ring-neutral-800 ring-offset-2">
          {!loading ? 'Create Delivery' : 'Creating delivery...'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;