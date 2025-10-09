import React from 'react';
import useAuth from '../../../shared/hooks/useAuth';
import type { Ride } from '../../../shared/types';

const AssignedDelivery: React.FC<{ delivery: Ride }> = ({ delivery }) => {
    return (
        <div className="h-full w-96 bg-gray-800 text-white flex flex-col p-6 shadow-2xl overflow-y-auto overflow-x-hidden">

            {/* Header */}
            <div className="mb-6">
                <div className="text-2xl font-bold text-cyan-400">Assigned Delivery</div>
                <p className="text-sm text-gray-400">You have a new ride</p>
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
                    <p className="text-xl font-bold">{delivery.distance}</p>
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


const NoDelivery: React.FC = () => {
    return (
        <div className="h-full w-96 bg-gray-800 text-white flex flex-col items-center justify-center p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">No Delivery Assigned</h2>
            <p className="text-sm text-gray-400 text-center">
                You are currently not assigned to any delivery. Please wait for an admin to assign you a ride.
            </p>
        </div>
    );
};

const DriverSidebar: React.FC = () => {
    const { delivery } = useAuth();
    return delivery ? <AssignedDelivery delivery={delivery} /> : <NoDelivery />;
};

export default DriverSidebar;