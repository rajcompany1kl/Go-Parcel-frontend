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

export interface Ride {
    adminId: string,
    driverId: string,
    rideStartAt: number,
    rideEndAt: number | null,
    isRideStarted: boolean,
    isRideEnded: boolean
    date: number,
    distance: string,
    leg: Leg,
    lastDriverLocation: Coordinates,
    route?: Route
}

export interface Route {
  legs: Omit<Leg,'start_address' | 'end_address'>[];
}

export interface Leg {
  start_address: string;
  end_address: string;
  start_location: Coordinates;
  end_location: Coordinates;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
export type CreateRideParams = {
    adminId: string;
    driverId: string;
    distance: string;
    startAddress: string;
    endAddress: string;
    start_location: Coordinates;
    end_location: Coordinates;
    initialDriverLocation: Coordinates;
};

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
    setRole: Dispatch<SetStateAction<RoleType>>;
    trackingId: string;
    setTrackingId: Dispatch<SetStateAction<string>>;
    delivery: Ride | null
    setDelivery: Dispatch<SetStateAction<Ride>>;
    fetchDelivery: (trackingId: string, navigate: any) => void;
    adminDeliveries: Ride[],
    setAdminDeliveries: Dispatch<SetStateAction<Ride[]>>
}

export interface LoginCredential { email: string, password: string }