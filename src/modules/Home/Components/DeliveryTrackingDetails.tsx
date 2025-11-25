import { useEffect, useState } from 'react';
import useAuth from '../../../shared/hooks/useAuth'
import useService from '../../../shared/hooks/useServices';
import type { Coordinates } from '../../../shared/types';
import { useToaster } from '../../../shared/hooks/useToast';
import HomeFactory from '../factory';
import { useMap } from '../../../shared/hooks/useMap';

const DeliveryTrackingDetails = () => {
    const { delivery, setDelivery, user } = useAuth()
    const { setOriginCoords, setDestinationCoords } = useMap()
    const toast = useToaster()
    const services = useService(toast.addToast)
 
    const [formattedDistance, setFormattedDistance] = useState<string>("")
    const [ lastDriverLocationAddress, setLastDriverLocationAddress ] = useState<string>("")

    const fetchAddress = async(driverLocation: Coordinates) => {
        const response = await services.home.getAddressUsingCoords(driverLocation.lat, driverLocation.lng)
        setLastDriverLocationAddress(response?.display_name)
    }

    async function setRouteCoordinates() {
        if(delivery) {
            setOriginCoords([delivery.leg.start_location.lat, delivery.leg.start_location.lng])
            setDestinationCoords([delivery.leg.end_location.lat, delivery.leg.end_location.lng])
        }
    }

    useEffect(() => {
        setRouteCoordinates()
    }, [user]);

    useEffect(() => {
        if(delivery) {
            fetchAddress(delivery.lastDriverLocation)
            const distanceInKm = Number(delivery.distance) / 1000;
            setFormattedDistance(`${distanceInKm.toFixed(2)} KM`)
        }
    },[delivery])

    return (
        <div className="h-full w-96 bg-white text-gray-900 flex flex-col p-6 border-r border-gray-200 shadow-lg overflow-y-auto">

            {/* Header */}
            <div className="mb-4">
                <div className="text-2xl font-semibold text-gray-900">Ride Details</div>
                <p className="text-sm text-gray-500">Live tracking information</p>
            </div>

            <hr className="border-gray-200 my-3" />

            {/* Route Section */}
            <div className="space-y-4 my-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</div>

                {/* Origin */}
                <div className="flex items-start gap-3">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600"
                        fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>

                    <div>
                        <p className="font-semibold text-gray-700">Origin</p>
                        <p className="text-sm text-blue-600">{delivery?.leg.start_address}</p>
                    </div>
                </div>

                {/* Destination */}
                <div className="flex items-start gap-3">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-600"
                        fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>

                    <div>
                        <p className="font-semibold text-gray-700">Destination</p>
                        <p className="text-sm text-blue-600">{delivery?.leg.end_address}</p>
                    </div>
                </div>
            </div>

            <hr className="border-gray-200 my-3" />

            {/* Metrics */}
            <div className="my-4 space-y-3">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Metrics</div>

                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Total Distance</p>
                    <p className="text-xl font-bold text-gray-900">{formattedDistance}</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Driver's Last Location</p>
                    <p className="text-sm font-mono text-gray-700">{lastDriverLocationAddress}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Parcel Info
                </div>

                <p className="text-sm text-gray-700 font-mono truncate">
                    <strong>Delivery Status:</strong> {delivery?.isRideEnded?'Completed':'Active'}
                </p>

                <p className="text-sm text-gray-700 font-mono truncate">
                    <strong>Item:</strong> {delivery?.itemDescription}
                </p>
            </div>
        </div>
    );
};

export default DeliveryTrackingDetails;
