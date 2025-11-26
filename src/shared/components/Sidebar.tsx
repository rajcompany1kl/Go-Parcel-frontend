import axios from "axios";
import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import * as AuthFactory from '../../modules/Auth/factory';
import DeliveryTrackingDetails from "../../modules/Home/Components/DeliveryTrackingDetails";
import DriverSidebar from "../../modules/Home/Components/DriverSidebar";
import HomeFactory from "../../modules/Home/factory";
import useAuth from "../hooks/useAuth";
import { useMap } from "../hooks/useMap";
import useService from "../hooks/useServices";
import { useSuggestions } from "../hooks/useSuggestions";
import { useToaster } from "../hooks/useToast";
import { formatRouteData, getEstimatedDeliveryDate } from "../Utils";
import { LocationPinIcon, SpinnerIcon } from "./ui/Icons";

const Sidebar: React.FC<{ 
  isSidebarOpen: boolean,
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>> 
}> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  type FieldType = "origin" | "destination" | "drivers";
  const serverUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [recieverName, setRecieverName] = useState("");
  const [originFixed, setOriginFixed] = useState<Boolean>(false)
  const [destinationFixed, setDestinationFixed] = useState<Boolean>(false)
  const [recieverPhone, setRecieverPhone] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [activeField, setActiveField] = useState<FieldType | null>('origin');
  const [routeData, setRouteData] = useState<{ distance: string, duration: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(false) 
  const [availableDrivers, setAvailableDrivers] = useState<AuthFactory.MongoDriverUserDocument[]>([])
  const [selectedDriver, setSelectedDriver] = useState<AuthFactory.MongoDriverUserDocument | null>(null)
  
  const { origin, destination, routeInfo, setOriginCoords, setDestinationCoords, originCoords, destinationCoords } = useMap()
  const { role, user,setDelivery, delivery, setTrackingId, setAdminDeliveries } = useAuth()
  const { addToast } = useToaster()
  const services = useService(addToast)

  const activeSearchTerm = activeField === "origin" ? originInput : destinationInput;
  const { suggestions, isLoading } = useSuggestions(activeSearchTerm);
  const handleChange = (value: string, field: FieldType) => {
    setActiveField(field);
    if (field === "origin") setOriginInput(value);
    else setDestinationInput(value);
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);


  const handleSelect = (place: { lat: number, lng: number, address: string }) => {
    if (activeField === "origin"){ setOriginCoords([place.lat,place.lng]);
      setOriginFixed(true);
     }
    else if(activeField === 'destination'){ setDestinationCoords([place.lat,place.lng])
      setDestinationFixed(true);
    }
  };

  async function createDelivery() {
    if(!selectedDriver || !originInput || !destinationInput || !recieverName || !recieverPhone || !itemDescription) {
      addToast('Please fill all the details to create a delivery!','error',2000)
      return
    }
    console.log('driver',selectedDriver)
    console.log('origin',originInput)
    setLoading(true)
    if(selectedDriver) {
      const driver = AuthFactory.createDriverUserAccount(selectedDriver)
      if(routeInfo && originCoords && destinationCoords) {
        const deliveryPayload = HomeFactory.createRide({
              adminId: user?.id as string,
              driverId: driver?.id as string,
              recieverName: recieverName,
              recieverPhone: recieverPhone,
              itemDescription: itemDescription,
              distance: routeInfo.distance.toString(),
              end_location: { lat: destinationCoords[0], lng: destinationCoords[1] },
              start_location: { lat: originCoords[0], lng: originCoords[1] },
              startAddress: originInput,
              endAddress: destinationInput,
              initialDriverLocation: { lat: originCoords[0], lng: originCoords[1] }
            });
        const response = await services.home.createDelivery(deliveryPayload)
        setTrackingId(response.ride._id)
        setDelivery(HomeFactory.createRideFromMongoDBResponse(response.ride))
        
// ⭐ SEND EMAIL TO RECEIVER
await axios.post(`${serverUrl}/api/send-email`, {
  to: `rajcompany1kl@gmail.com`,   // you can change this
  subject: "Your Delivery Tracking ID",
  text: `Your delivery has been created!\nTracking ID: ${response.ride._id}`,
});
        setLoading(false)
        setDestinationInput("")
        setOriginInput("")
        if(isSidebarOpen) setIsSidebarOpen(false)
        if(response.data) addToast("Delivery created successfully!")
      }
    }
  } 
  useEffect(() => {
  if (delivery) {
    // this runs AFTER delivery is updated
    console.log("delivery updated:", delivery);
  }
}, [delivery]);


  function resetDeliveryCreation() {
    setSelectedDriver(null)
    setOriginCoords(null)
    setDestinationCoords(null)
    setRouteData(null)
    setDelivery(null as any)
    setDestinationFixed(false)
    setOriginFixed(false)
    setRecieverName('')
    setRecieverPhone('')
    setItemDescription('')
    setActiveField(null)
    setDestinationInput("")
    setOriginInput("")
  }

  async function endDelivery() {
    if(delivery) {
      await services.home.endDelivery(delivery.driverId)
        .then((res) => {
          if(res.success) {
            setAdminDeliveries((prev) => prev.filter((d) => d.driverId !== delivery.driverId))
            console.log(delivery.driverId);
            resetDeliveryCreation()
          } else {
            addToast('Failed to end delivery','error')
          }
        })
        .catch((err) => {
          console.error(err)
          addToast('An error occurred while ending the delivery','error')
        })
       resetDeliveryCreation();
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

  const searchDroptown = () => {
    return (
    <div>
       <div className="absolute w-full z-900">
          {isLoading && (
            <div className="flex items-center justify-center p-4 text-gray-500">
              <SpinnerIcon />
              <span className="ml-2">Searching...</span>
            </div>
          )}
          {((activeField !== 'drivers' && suggestions.length > 0) || (activeField == 'drivers' && availableDrivers.length > 0)) && !isLoading && (
            <ul className="absolute  w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-900 max-h-60 overflow-y-auto">
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
          {activeField == 'drivers' && availableDrivers.length == 0 && !isLoading && (
            <ul className="absolute  w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-900 max-h-60 overflow-y-auto">
              {activeField == 'drivers' && 
                <li 
                  className="px-4 py-2.5 cursor-pointer hover:bg-blue-50 text-gray-700 transition-colors"
                >
                  No drivers available
                </li>
              }
            </ul>
          )}
        </div>
    </div>
    )
  }

  return (
    <div className="w-96 bg-white shadow-2xl p-6 font-sans flex flex-col h-full sm:h-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Route Planner</h1>

      <div className="space-y-5 flex-grow relative">
        <div className="relative">
          <label className="font-semibold text-gray-600 text-sm mb-1 block">Pickup Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LocationPinIcon />
            </div>
            {delivery?<>
            <div className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              {capitalize(delivery.leg.start_address)}
            </div>
            </>:<>
            <input
              type="text"
              value={originInput}
              onChange={(e) => handleChange(e.target.value, "origin")}
              placeholder="Enter a starting point"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {originInput.length > 0 && !originFixed && searchDroptown()}
            </>}
          
          </div>
        </div>

        <div className="relative">
          <label className="font-semibold text-gray-600 text-sm mb-1 block">Drop-off Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LocationPinIcon />
            </div>

             {delivery?<>
            <div className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              {capitalize(delivery.leg.end_address)}
            </div>
            </>:<>
          <input
              type="text"
              value={destinationInput}
              onChange={(e) => handleChange(e.target.value, "destination")}
              placeholder="Enter a destination"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {destinationInput.length > 0 && !destinationFixed && searchDroptown()}
            </>}
          </div>
        </div>

         {delivery?<>
            </>:<>
          <div className="flex justify-start items-center space-x-4">
          {selectedDriver ? <p className="text-xl text-gray-600 tracking-wide font-bold">Selected Driver</p> : <button className="w-fit hover:cursor-pointer text-white font-medium py-1.5 px-2 rounded-lg bg-neutral-800" onClick={() => setActiveField('drivers')}>Select Driver</button>}
          {!selectedDriver && destinationFixed && originFixed && (activeField == 'drivers') &&  searchDroptown()}
          {selectedDriver && <p className="text-xl text-gray-600 tracking-wide font-light">{selectedDriver.firstName} {selectedDriver.lastName}</p>}
        </div>
        </>}
        
        <div>
          <label className="font-semibold text-gray-600 text-sm mb-1 block">Reciever Info</label>
           {delivery?<>
             <div className="w-full pl-5 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"><span className="text-gray-700">RecieverName:</span> {delivery.recieverName}</div>
             <div className="mt-2 w-full pl-5 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"><span className="text-gray-700">RecieverPhone:</span> {delivery.recieverPhone}</div>
             <div className="mt-2 w-full pl-5 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"><span className="text-gray-700">ItemDescription:</span> {delivery.itemDescription}</div>
            </>:<>
           <input type="text" value={recieverName} onChange={(e) => setRecieverName(e.target.value)} placeholder="Reciever Name"  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
        <input type="text" value={recieverPhone} onChange={(e) => setRecieverPhone(e.target.value)} placeholder="Reciever Ph. No."  className="mt-2 w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
        <input type="text" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="Item Description"  className="mt-2 w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
            </>}
      
        </div>
        
       
      </div>

      {origin && destination && routeInfo && <div className="space-y-1 bg-slate-50 shadow-lg rounded-md p-2">
        <div className="flex flex-col">
          <p className="text-base"><strong>Distance:</strong> {routeData?.distance}</p>
          <p className="text-base"><strong>ETA:</strong> {routeData?.duration}</p>
        </div>
      </div>}

      {delivery ? <div className="mt-6 flex gap-5">
        <button onClick={endDelivery} className="hover:cursor-pointer w-full text-white font-bold py-3 px-4 rounded-lg bg-neutral-800 transition-all duration-300 transform hover:ring-2 ring-neutral-800 ring-offset-2">
          End delivery
        </button>
        <button onClick={resetDeliveryCreation} className="hover:cursor-pointer w-full text-white font-bold py-3 px-4 rounded-lg bg-neutral-800 transition-all duration-300 transform hover:ring-2 ring-neutral-800 ring-offset-2">
          Create More
        </button>
      </div> : <div className="mt-4">
        <button onClick={createDelivery} className="hover:cursor-pointer w-full text-white font-bold py-3 px-4 rounded-lg bg-neutral-800 transition-all duration-300 transform hover:ring-2 ring-neutral-800 ring-offset-2">
          {!loading ? 'Create Delivery' : 'Creating delivery...'}
        </button>
      </div>}
    </div>
  );
};

export default Sidebar;