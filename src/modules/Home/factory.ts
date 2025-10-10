import { ContextMenuItemType, type ContextMenuType } from "../../shared/components/ui/ContextMenu";
import type { CreateRideParams, Leg, Ride } from "../../shared/types";



/**
 * Creates a new Ride object.
 * @param params - The parameters to create the ride with.
 * @returns A new Ride object.
 */
export const createRide = ({
    adminId,
    driverId,
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
        driverId,
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

    console.log(newRide)
    return newRide;
};

export const createRideFromMongoDBResponse = (dto: any): Ride => {
    return {
        adminId: dto.adminId,
        driverId: dto.driverId,
        rideStartAt: dto.rideStartAt,
        rideEndAt: dto.rideEndAt,
        isRideStarted: dto.isRideStarted,
        isRideEnded: dto.isRideEnded,
        date: dto.date,
        distance: dto.distance,
        leg: {
            start_address: dto.leg.start_address,
            end_address: dto.leg.end_address,
            start_location: {
                lat: dto.leg.start_location.lat,
                lng: dto.leg.start_location.lng,
            },
            end_location: {
                lat: dto.leg.end_location.lat,
                lng: dto.leg.end_location.lng,
            },
        },
        lastDriverLocation: {
            lat: dto.lastDriverLocation.lat,
            lng: dto.lastDriverLocation.lng,
        },
        route: dto.route
            ? {
                  legs: dto.route.legs.map((leg: Omit<Leg,'startAddress' | 'endAddress'>) => ({
                      start_location: leg.start_location,
                      end_location: leg.end_location,
                  })),
              }
            : undefined,
    };
};

export const createAdminDeliveriesContextMenuItems = (deliveries: Ride[], setOriginCoords: any, setDestinationCoords: any, setDelivery: (delivery: Ride) => void): ContextMenuType[] => {
    const menu: ContextMenuType[] = []
    for(let delivery of deliveries) {
        if(delivery.leg.start_address !== '' && delivery.leg.end_address !== '') {
            menu.push({ 
                key: `${delivery.driverId}-${delivery.adminId}`, 
                label: `${delivery.leg.start_address.split(',')[0]} - ${delivery.leg.end_address.split(',')[0]}`, 
                type: ContextMenuItemType.ITEM, 
                action: () => {
                    setOriginCoords([delivery.leg.start_location.lat,delivery.leg.start_location.lng])
                    setDestinationCoords([delivery.leg.end_location.lat,delivery.leg.end_location.lng])
                    setDelivery(delivery)
                }
            }) 
        }
    }
    return menu;
}

const HomeFactory = {createRide, createRideFromMongoDBResponse, createAdminDeliveriesContextMenuItems}
export default HomeFactory