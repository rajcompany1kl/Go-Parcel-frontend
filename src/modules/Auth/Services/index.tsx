import type { AdminUserAccount, DriverUserAccount, LoginCredential, ToastFunction } from "../../../shared/types"
import http from "../../../shared/Utils/http"

const AuthService = (toast: ToastFunction) => {
    async function adminLogin(credentials: LoginCredential) {
        try {
            const response = await http.post('/AdminUser/login',credentials)
            console.log(response)
            toast('Login Successfull!','success')
            return response
        } catch (error: any) {
             const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
           
            toast(msg,'error')
        }
    }

    async function adminSignup(registerPayload: Omit<AdminUserAccount,'id'>) {
        try {
            const response = await http.post('/AdminUser/signup',registerPayload)
            console.log(response)
            toast('Signup Successfull!','success')
            return response
        } catch (error: any) {
              const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
            toast(msg,'error')
        }
    }

    async function driverLogin(credentials: LoginCredential) {
        try {
            const response = await http.post('/DriverUser/login',credentials)
            console.log(response)
            toast('Login Successfull!','success')
            return response
        } catch (error: any) {
          const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
            toast(msg,'error')
        }
    }

    async function driverSignup(registerPayload: Omit<DriverUserAccount,'id' | 'status' | 'currentLoc'>) {
        try {
            const response = await http.post('/DriverUser/signup',registerPayload)
            console.log(response)
            toast('Signup Successfull!','success')
            return response
        } catch (error: any) {
           const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
            toast(msg,'error')
        }
    }
    return {
        admin: { login: adminLogin, signup: adminSignup },
        driver: { login: driverLogin, signup: driverSignup }
    }
}

export default AuthService