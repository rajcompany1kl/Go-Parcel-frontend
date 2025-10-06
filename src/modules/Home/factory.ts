import type { CreateRideParams, Ride } from "../../shared/types";



/**
 * Creates a new Ride object.
 * @param params - The parameters to create the ride with.
 * @returns A new Ride object.
 */
export const createRide = ({
    adminId,
    distance,
    startAddress,
    endAddress,
    start_location,
    end_location,
    initialDriverLocation,
}: CreateRideParams): Ride => {
    const creationTime = Date.now();

    const newRide: Ride = {
        adminId,
        driverId: '',
        rideStartAt: creationTime,
        rideEndAt: null,
        isRideStarted: true,
        isRideEnded: false,
        date: creationTime,
        distance,
        lastDriverLocation: initialDriverLocation,
        leg: {
            start_address: startAddress,
            end_address: endAddress,
            start_location: start_location,
            end_location: end_location,
        },
        route: {
            legs: [
                {
                    start_location: start_location,
                    end_location: end_location,
                },
            ],
        },
    };

    return newRide;
};

const HomeFactory = {createRide}
export default HomeFactory