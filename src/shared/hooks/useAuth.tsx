import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

const useAuth = () => {
    const context = useContext(AuthContext)
    if(context == undefined) {
        // implement toast
    }
    return context

}

export default useAuth