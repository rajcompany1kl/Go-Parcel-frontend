import type { Dispatch, SetStateAction } from "react"

export interface AdminUserAccount {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: number,
    password: string
}

type Location = { lat: number, lng: number }

export enum DriverRideStatus {
    AVAILABLE,
    NOT_AVAILABLE
}

export interface DriverUserAccount {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: number,
    password: string,
    status: DriverRideStatus,
    currentLoc: Location
}

export interface Rides {
    adminId: string,
    driverId: string,
    rideStartAt: number,
    rideEndAt: number | null,
    isRideStarted: boolean,
    isRideEnded: boolean
    date: number,
    distance: string,
    direction: DirectionsResponse | null
}

export interface DirectionsResponse {
  routes: Route[];
}

export interface Route {
  legs: Leg[];
}

export interface Leg {
  start_address: string;
  end_address: string;
  start_location: Coordinates;
  end_location: Coordinates;
  distance: Distance;
  duration: Duration;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Distance {
  text: string;   // e.g., "215 mi"
  value: number;  // in meters
}

export interface Duration {
  text: string;   // e.g., "3 hours 45 mins"
  value: number;  // in seconds
}

export type IconType = {
    className:string
}

export type RoleType = 'admin' | 'user' | 'driver'

export interface AuthContextType {
    user: AdminUserAccount | DriverUserAccount | null;
    login: (role: string, credential: {email: string, password: string}, navigate: any) => Promise<boolean>;
    register: (role: string, userObject: AdminUserAccount | DriverUserAccount, setFormState: (formState: boolean) => void) => Promise<boolean>,
    logout: (navigate: any) => void;
    getToken: () => string;
    role: RoleType;
    setRole: Dispatch<SetStateAction<RoleType>>
}

export interface LoginCredential { email: string, password: string }