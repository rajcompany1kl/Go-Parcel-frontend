import type { Rides } from "../types";
import { CalendarIcon, CheckCircleIcon, ClockIcon, MapPinIcon, NavigationIcon, PauseIcon, PlayIcon } from "./ui/Icons";

interface RideCardProps {
    ride: Rides;
}

const RideCard: React.FC<RideCardProps> = ({ ride }) => {
    // Helper functions
    const formatDate = (timestamp: number): string => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (timestamp: number): string => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRideStatus = () => {
        if (ride.isRideEnded) {
            return { 
                text: 'Completed', 
                bgColor: 'bg-green-100', 
                textColor: 'text-green-800',
                icon: CheckCircleIcon
            };
        }
        if (ride.isRideStarted) {
            return { 
                text: 'In Progress', 
                bgColor: 'bg-blue-100', 
                textColor: 'text-blue-800',
                icon: PlayIcon
            };
        }
        return { 
            text: 'Scheduled', 
            bgColor: 'bg-yellow-100', 
            textColor: 'text-yellow-800',
            icon: PauseIcon
        };
    };

    const getDuration = (): string | null => {
        if (!ride.rideEndAt || !ride.isRideEnded) return null;
        const duration = ride.rideEndAt - ride.rideStartAt;
        const minutes = Math.floor(duration / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${remainingMinutes}m`;
    };

    const getFirstLeg = () => ride.direction?.routes[0]?.legs[0];
    const status = getRideStatus();
    const leg = getFirstLeg();
    const duration = getDuration();
    const StatusIcon = status.icon;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor} ${status.textColor} text-xs font-medium`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.text}
                    </div>
                    <div className="text-xs opacity-75">
                        {formatDate(ride.date)}
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <NavigationIcon />
                    </div>
                    <div>
                        <div className="font-semibold text-sm">Ride #{ride.adminId.slice(-6)}</div>
                        <div className="text-xs opacity-75">Driver ID: {ride.driverId.slice(-6)}</div>
                    </div>
                </div>
            </div>

            {/* Route Information */}
            <div className="p-4">
                <div className="space-y-3">
                    {/* Start Location */}
                    <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center mt-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="w-0.5 h-6 bg-gray-300 mt-1"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500 mb-1">From</div>
                            <div className="text-sm font-medium text-gray-900 truncate">
                                {leg?.start_address || 'Pickup location'}
                            </div>
                        </div>
                    </div>

                    {/* End Location */}
                    <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500 mb-1">To</div>
                            <div className="text-sm font-medium text-gray-900 truncate">
                                {leg?.end_address || 'Drop-off location'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trip Details */}
            <div className="px-4 pb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <ClockIcon />
                            <div>
                                <div className="text-gray-500">Start Time</div>
                                <div className="font-medium text-gray-900">
                                    {formatTime(ride.rideStartAt)}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <MapPinIcon />
                            <div>
                                <div className="text-gray-500">Distance</div>
                                <div className="font-medium text-gray-900">
                                    {leg?.distance?.text || ride.distance}
                                </div>
                            </div>
                        </div>
                        
                        {duration && (
                            <div className="flex items-center gap-2 col-span-2">
                                <CalendarIcon />
                                <div>
                                    <div className="text-gray-500">Duration</div>
                                    <div className="font-medium text-gray-900">{duration}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            {ride.isRideStarted && !ride.isRideEnded && (
                <div className="px-4 pb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-blue-800 text-xs font-medium">Ride in progress...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RideCard