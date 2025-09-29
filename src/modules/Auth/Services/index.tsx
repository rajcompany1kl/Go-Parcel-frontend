import type { AdminUserAccount, DriverUserAccount, LoginCredential } from "../../../shared/types"
import http from "../../../shared/Utils/http"

const AuthService = {
    admin: {
        login: async (credentials: LoginCredential) => {
            try {
                const response = await http.post('/AdminUser/login',credentials)
                console.log(response)
                return response
            } catch (error) {
                console.error(error)
            }
        },
        signup: async (registerPayload: Omit<AdminUserAccount,'id'>) => {
            try {
                const response = await http.post('/AdminUser/signup',registerPayload)
                console.log(response)
                return response
            } catch (error) {
                console.error(error)
            }
        }
    },
    driver: {
        login: async (credentials: LoginCredential) => {
            try {
                const response = await http.post('/DriverUser/login',credentials)
                console.log(response)
                return response
            } catch (error) {
                console.error(error)
            }
        },
        signup: async (registerPayload: Omit<DriverUserAccount,'id' | 'status' | 'currentLoc'>) => {
            try {
                const response = await http.post('/DriverUser/signup',registerPayload)
                console.log(response)
                return response
            } catch (error) {
                console.error(error)
            }
        }
    }
}

export default AuthService