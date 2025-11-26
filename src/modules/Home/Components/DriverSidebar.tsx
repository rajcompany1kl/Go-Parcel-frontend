import React, { useEffect } from 'react';
import useAuth from '../../../shared/hooks/useAuth';
import type { Ride } from '../../../shared/types';
import { useToaster } from '../../../shared/hooks/useToast';
import useService from '../../../shared/hooks/useServices';
import HomeFactory from '../factory';
import { useMap } from '../../../shared/hooks/useMap';

const AssignedDelivery: React.FC<{ delivery: Ride }> = ({ delivery }) => {
     const { setDelivery} = useAuth();
      const { addToast } = useToaster()
    const services = useService(addToast)
  async function endDelivery() {
    if(delivery) {
      await services.home.endDelivery(delivery.driverId)
        .then((res) => {
          if(res.success) {
              // 🔥 KEY LINE — this shows NoDelivery
            setDelivery(null as unknown as any);
            console.log(delivery.driverId);
          
          } else {
            addToast('Failed to end delivery','error')
          }
        })
        .catch((err) => {
          console.error(err)
          addToast('An error occurred while ending the delivery','error')
        })
    }
  }
    return (
        <div className="h-full w-96 bg-white text-gray-900 flex flex-col p-6 border-r border-gray-200 overflow-y-auto">

            {/* Header */}
            <div className="mb-4">
                <div className="text-2xl font-semibold text-gray-900">Assigned Delivery</div>
                <p className="text-sm text-gray-500">You have a new ride</p>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 my-3" />

            {/* Route Section */}
            <div className="space-y-4 my-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</div>

                {/* Origin */}
                <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600"
                        fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={2}>
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
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-600"
                        fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={2}>
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

            {/* Divider */}
            <hr className="border-gray-200 my-3" />

            {/* Metrics */}
            <div className="my-3 space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Metrics
                </div>

                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Total Distance</p>
                    <p className="text-xl font-bold text-gray-900">{delivery.distance}</p>
                </div>
            </div>

            {/* IDs */}
            <div className="mt-auto pt-6 border-t border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Reciever info
                </div>

                <p className="text-sm text-gray-700 font-mono truncate">
                    <strong>Name:</strong> {delivery?.recieverName}
                </p>
                <p className="text-sm text-gray-700 font-mono truncate">
                    <strong>Phone No.:</strong> {delivery?.recieverPhone}
                </p>
            </div>
              {delivery ? <div className="mt-6 flex gap-5">
        <button onClick={endDelivery} className="w-full text-white font-bold py-3 px-4 rounded-lg bg-neutral-800 transition-all duration-300 transform hover:ring-2 ring-neutral-800 ring-offset-2">
          Delivered?
        </button>
      </div>:<></>}
        </div>
    );
};

const NoDelivery: React.FC = () => {
    return (
        <div className="h-full w-96 bg-white text-gray-900 flex flex-col items-center justify-center p-6 border-r border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Delivery Assigned</h2>
            <p className="text-sm text-gray-500 text-center">
                You are currently not assigned to any delivery.  
                Please wait for an admin to assign a ride.
            </p>
        </div>
    );
};

const DriverSidebar: React.FC = () => {
    const { delivery, setDelivery, user } = useAuth();
    const { setOriginCoords, setDestinationCoords } = useMap();
    const toast = useToaster();
    const services = useService(toast.addToast);

    async function getAssignedDelivery() {
        if (user) {
            const response = await services.home.getDriverDelivery(user.id);
            setDelivery(HomeFactory.createRideFromMongoDBResponse(response.ride));
            setOriginCoords([response.ride.leg.start_location.lat, response.ride.leg.start_location.lng]);
            setDestinationCoords([response.ride.leg.end_location.lat, response.ride.leg.end_location.lng]);
        }
    }

    useEffect(() => {
        if(user?.id){
        getAssignedDelivery();
        }
    }, [user]);

    return delivery ? <AssignedDelivery delivery={delivery} /> : <NoDelivery />;
};

export default DriverSidebar;
