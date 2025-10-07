import { useEffect, useState } from 'react';
import useAuth from '../../../shared/hooks/useAuth'
import useService from '../../../shared/hooks/useServices';
import type { Coordinates } from '../../../shared/types';

const DeliveryTrackingDetails = () => {
    const { delivery } = useAuth()
    const services = useService()
 
    const [formattedDistance, setFormattedDistance] = useState<string>("")
    const [ lastDriverLocationAddress, setLastDriverLocationAddress ] = useState<string>("")

    const fetchAddress = async(driverLocation: Coordinates) => {
        const response = await services.home.getAddressUsingCoords(driverLocation.lat, driverLocation.lng)
        setLastDriverLocationAddress(response?.display_name)
    }

    useEffect(() => {
        if(delivery) {
            fetchAddress(delivery.lastDriverLocation)
            const distanceInKm = Number(delivery.distance) / 1000;
            setFormattedDistance(`${distanceInKm.toFixed(2)} KM`)
        }
    },[delivery])

    return (
        // Sidebar Container
        <div className="h-full w-96 bg-gray-800 text-white flex flex-col p-6 shadow-2xl overflow-y-auto overflow-x-hidden">

            {/* Header */}
            <div className="mb-6">
                <div className="text-2xl font-bold text-cyan-400">Ride Details</div>
                <p className="text-sm text-gray-400">Live tracking information</p>
            </div>

            {/* Divider */}
            <hr className="border-gray-600 my-2" />

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
                        <p className="text-sm text-cyan-400">{delivery?.leg.start_address}</p>
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
                        <p className="text-sm text-cyan-400">{delivery?.leg.end_address}</p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-600 my-2" />

            {/* Key Metrics */}
            <div className="my-4 space-y-3">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Metrics</div>
                <div className="bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Total Distance</p>
                    <p className="text-xl font-bold">{formattedDistance}</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Driver's Last Location</p>
                    <p className="text-md font-mono">{lastDriverLocationAddress}</p>
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