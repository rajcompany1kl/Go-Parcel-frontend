import moment from "moment";
import { DriverRideStatus, type AdminUserAccount, type DirectionsResponse, type DriverUserAccount, type Rides } from "../types";

const mockAdmins: AdminUserAccount[] = [
    { 
        id: '1', 
        firstName: 'Sarah', 
        lastName: 'Johnson', 
        email: 'sarah.johnson@gmail.com', 
        password: '123456', 
        phone: 1234567890 
    },
    { 
        id: '2', 
        firstName: 'Ben', 
        lastName: 'Stark', 
        email: 'ben.stark@gmail.com', 
        password: '123456', 
        phone: 3216549870 
    }
]

const mockDriver: DriverUserAccount[] = [
    { 
        id: '1', 
        firstName: 'Emily', 
        lastName: 'Clark', 
        email: 'emily.clark@gmail.com', 
        password: '123456', 
        phone: 6780952391, 
        status: DriverRideStatus.NOT_AVAILABLE, 
        currentLoc: {lat: 0.0, lng: 0.0} 
    },
    { 
        id: '2', 
        firstName: 'James', 
        lastName: 'Baggins', 
        email: 'james.baggins@gmail.com', 
        password: '123456', 
        phone: 6780952393, 
        status: DriverRideStatus.NOT_AVAILABLE, 
        currentLoc: {lat: 0.0, lng: 0.0} 
    },
]

const mockDirection: DirectionsResponse = {
  "routes": [
    {
      "legs": [
        {
          "start_address": "Fatehsagar Lake, Udaipur, Rajasthan, India",
          "end_address": "Pichola Lake, Udaipur, Rajasthan, India",
          "start_location": { "lat": 24.6060, "lng": 73.6822 },
          "end_location": { "lat": 24.5794, "lng": 73.6829 },
          "distance": { "text": "3.2 km", "value": 3200 },
          "duration": { "text": "10 mins", "value": 600 }
        }
      ]
    }
  ]
}

const mockRides: Rides[] = [
    {
        adminId: '2',
        driverId: '1',
        date: moment().valueOf(),
        distance: '10 km',
        isRideEnded: false,
        isRideStarted: true,
        rideEndAt: null,
        rideStartAt: moment().subtract(30, 'minutes').valueOf(),
        direction: mockDirection
    }
]


export { mockAdmins, mockDriver, mockRides }