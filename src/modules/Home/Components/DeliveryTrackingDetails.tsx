import { useEffect, useState } from 'react';
import useAuth from '../../../shared/hooks/useAuth'
import useService from '../../../shared/hooks/useServices';
import type { Ride } from '../../../shared/types';
import HomeFactory from '../factory';

const DeliveryTrackingDetails = () => {
  const { trackingId } = useAuth()
  const services = useService()

  const [ delivery, setDelivery ] = useState<Ride | null>(null)
  const [ formattedDistance, setFormattedDistance ] = useState<string>("")

  const fetchDetails = async() => {
    const response = await services.home.getDeliveryDetails(trackingId)
    console.log(response.rides)
    if(response.rides) {
      console.log(response.rides)
      const deliveryInformation: Ride = HomeFactory.createRideFromMongoDBResponse(response.rides)
      setDelivery(deliveryInformation)
    }
  }

  useEffect(() => {
    fetchDetails()
  },[])


  const ride = {
        adminId: 'adm_1a2b3c4d5e6f7g8h',
        driverId: 'drv_9i0j1k2l3m4n5o6p',
        rideStartAt: 1728225600000, // Corresponds to Oct 06 2025 17:30:00 GMT+0530
        rideEndAt: null,
        isRideStarted: true,
        isRideEnded: false,
        date: 1728225600000,
        distance: "712 KM",
        leg: {
            start_address: "Fateh Sagar Lake, Udaipur, Rajasthan",
            end_address: "Marine Drive, Mumbai, Maharashtra",
            start_location: { lat: 24.60, lng: 73.68 },
            end_location: { lat: 18.94, lng: 72.82 },
        },
        lastDriverLocation: { lat: 24.57, lng: 73.68 },
    };

    // Helper function to format timestamp
    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'NULL';
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        // Sidebar Container
        <div className="h-full w-96 bg-gray-800 text-white flex flex-col p-6 shadow-2xl">
            
            {/* Header */}
            <div className="mb-6">
                <div className="text-2xl font-bold text-cyan-400">Ride Details</div>
                <p className="text-sm text-gray-400">Live tracking information</p>
            </div>

            {/* Divider */}
            <hr className="border-gray-600 my-2"/>

            {/* Route Details Section */}
            <div className="space-y-4 my-4">
                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</div>
                {/* Start Address */}
                <div className="flex items-start gap-4">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-300">Origin</p>
                        <p className="text-cyan-400">{delivery?.leg.start_address}</p>
                    </div>
                </div>
                {/* End Address */}
                <div className="flex items-start gap-4">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-300">Destination</p>
                        <p className="text-cyan-400">{delivery?.leg.end_address}</p>
                    </div>
                </div>
            </div>
            
            {/* Divider */}
            <hr className="border-gray-600 my-2"/>

            {/* Key Metrics */}
            <div className="my-4 space-y-3">
                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Metrics</div>
                 <div className="bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Total Distance</p>
                    <p className="text-xl font-bold">{delivery?.distance}</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Driver's Last Location</p>
                    <p className="text-lg font-mono">lat: {delivery?.lastDriverLocation.lat}, lng: {delivery?.lastDriverLocation.lng}</p>
                </div>
            </div>

            {/* Footer / IDs */}
            <div className="mt-auto pt-6 border-t border-gray-700">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Reference IDs</div>
                <p className="text-sm text-gray-400 font-mono truncate">
                    <strong>Admin:</strong> {delivery?.adminId}
                </p>
                <p className="text-sm text-gray-400 font-mono truncate">
                    <strong>Driver:</strong> {delivery?.driverId}
                </p>
            </div>
        </div>
    );
};

export default DeliveryTrackingDetails