import { createContext, useEffect, useState, type ReactNode } from "react";
import { DriverRideStatus, type AdminUserAccount, type AuthContextType, type DriverUserAccount, type RoleType } from "../types";
import Cookies from "js-cookie";
import * as AuthFactory from '../../modules/Auth/factory'
import AuthService from "../../modules/Auth/Services";

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
    setTrackingId: () => {}
})

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<DriverUserAccount | AdminUserAccount | any>();
    const [ role, setRole ] = useState<RoleType>('admin')
    const [trackingId, setTrackingId] = useState<string>("")

    const logout = (navigate: any) => {
        Cookies.remove('authToken')
        navigate('/auth')
        localStorage.clear()
        setUser(default_values.admin);
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

    const getUser = () => {
        const storedUser = localStorage.getItem('user');
        if(storedUser != null) {
            const parsedUserData = JSON.parse(storedUser);
            setUser(parsedUserData);
        }
    };

    const getToken = () => Cookies.get('authToken') || ""
    
    useEffect(() => {
        if (Cookies.get('authToken') && role != 'user') {
            getUser()
        } else if (!Cookies.get('authToken') && window.location.pathname !== '/auth' && role !== 'user') {
            window.location.href = '/auth'
        }
    }, []);

    return (
        <AuthContext.Provider value={{logout, user, login, register, getToken, role, setRole, trackingId, setTrackingId}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider