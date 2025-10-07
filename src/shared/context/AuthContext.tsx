import { createContext, useEffect, useState, type ReactNode } from "react";
import { DriverRideStatus, type AdminUserAccount, type AuthContextType, type Coordinates, type DriverUserAccount, type Ride, type RoleType } from "../types";
import Cookies from "js-cookie";
import * as AuthFactory from '../../modules/Auth/factory'
import AuthService from "../../modules/Auth/Services";
import useService from "../hooks/useServices";
import HomeFactory from "../../modules/Home/factory";
import { useMap } from "../hooks/useMap";
import { io, Socket } from "socket.io-client";

const SERVER = 'http://localhost:5000';


export const default_values = {
    admin: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: 0 ,
    },
    driver: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: 0,
        status: DriverRideStatus.NOT_AVAILABLE,
        currentLoc: {lat: 0.0, lng: 0.0}
    }
}

export const AuthContext = createContext<AuthContextType>({
    logout: () => {},
    login: () => Promise.resolve(false),
    register: () => Promise.resolve(false),
    user: null,
    getToken: () => "",
    role: 'admin',
    setRole: () => {},
    trackingId: "",
    setTrackingId: () => {},
    delivery: null,
    setDelivery: () => {},
    fetchDelivery: () => {}
})

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<DriverUserAccount | AdminUserAccount | any>();
    const [ role, setRole ] = useState<RoleType>('admin')
    const [trackingId, setTrackingId] = useState<string>("")
    const [ delivery, setDelivery ] = useState<Ride | any>(null)
    const [socket, setSocket] = useState<Socket | null>(null);


    const services = useService()
    const { setOrigin, setDestination } = useMap()

    useEffect(() => {
        if (role === 'user' && delivery) {
            const newSocket = io(SERVER);
            setSocket(newSocket);

            newSocket.emit('joinRide', delivery.adminId);

            newSocket.on('locationUpdate', (location: Coordinates) => {
                setDelivery((prevDelivery: Ride) => ({
                    ...prevDelivery,
                    lastDriverLocation: location,
                }));
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [role, delivery]);


    const logout = (navigate: any) => {
        if(role === 'admin' || role === 'driver') {
            Cookies.remove('authToken')
            navigate('/auth')
            localStorage.clear()
            setUser(default_values.admin);
        } else {
            setDelivery(null)
            localStorage.removeItem('delivery')
        }
    }

    async function login(
        role: string,
        credential: {email: string, password: string},
        navigate: any
    ) {
        const request = role === 'driver' ? AuthService.driver.login : AuthService.admin.login
        const response = await request(credential)
        if(response) {
            const userObject = AuthFactory.createAdminUserAccount(role === 'driver' ? response.data.driver : response.data.user)
            localStorage.setItem('user',JSON.stringify(userObject))
            localStorage.setItem('role', role)
            const expiry = new Date(Date.now() + 30 * 60 * 1000);
            Cookies.set('authToken',response.data.token,{expires: expiry})
            setUser(userObject)
            navigate('/')
            return true
        }
        return false
    }

    async function register(
        role: string,
        userObject: Omit<AdminUserAccount,'id'> | Omit<DriverUserAccount,'id' | 'status' | 'currentLoc'>,
        setFormState: (formState: boolean) => void
    ) {
        const request = role === 'driver' ? AuthService.driver.signup : AuthService.admin.signup
        const response = await request(userObject);
        if(response) {
            setFormState(true)
            return true
        } else return false
    }

    async function fetchDelivery(trackingId: string, navigate: any) {
        localStorage.setItem('role', role)
        const response = await services.home.getDeliveryDetails(trackingId)
        if (response.rides) {
            const deliveryInformation: Ride = HomeFactory.createRideFromMongoDBResponse(response.rides)
            setDelivery(deliveryInformation)
            localStorage.setItem('delivery',JSON.stringify(deliveryInformation))
            setOrigin(deliveryInformation.leg.start_address)
            setDestination(deliveryInformation.leg.end_address)
            navigate('/')
        }
    }

    const getUser = () => {
        const storedUser = localStorage.getItem('user');
        if(storedUser != null) {
            const parsedUserData = JSON.parse(storedUser);
            setUser(parsedUserData);
        }
    };

    const getRole = () => {
        const existingRole = localStorage.getItem('role')
        if(existingRole !== null) {
            const parsedRole: RoleType = existingRole as RoleType

            if(parsedRole !== 'user') {
                if (Cookies.get('authToken')) {
                    getUser()
                } else if (!Cookies.get('authToken') && window.location.pathname !== '/auth') {
                    window.location.href = '/auth'
                }
            } else if (parsedRole === 'user' && localStorage.getItem('delivery')) {
                getDelivery()
            } else if(parsedRole === 'user' && !localStorage.getItem('delivery') && window.location.pathname !== '/auth') {
                window.location.href = '/auth'
            }


            setRole(parsedRole)
        } else {
            if (window.location.pathname !== '/auth') {
                window.location.href = '/auth';
            }
        }
    }

    const getDelivery = () => {
        const storedDelivery = localStorage.getItem('delivery');
        if(storedDelivery != null) {
            const parsedUserDelivery = JSON.parse(storedDelivery);
            setDelivery(parsedUserDelivery);
            setOrigin(parsedUserDelivery.leg.start_address)
            setDestination(parsedUserDelivery.leg.end_address)
        }
    };

    const getToken = () => Cookies.get('authToken') || ""

    useEffect(() => {
        getRole()
    }, []);

    return (
        <AuthContext.Provider value={{
            logout,
            user,
            login,
            register,
            getToken,
            role,
            setRole,
            trackingId,
            setTrackingId,
            delivery,
            setDelivery,
            fetchDelivery
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
