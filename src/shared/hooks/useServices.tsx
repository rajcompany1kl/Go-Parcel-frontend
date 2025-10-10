import AuthService from "../../modules/Auth/Services";
import HomeServices from "../../modules/Home/Services";
import type { ToastFunction, ToastType } from "../types";

const useService = (toast: ToastFunction) => { 
    return {
        home: HomeServices(toast),
        auth: AuthService(toast)
    }
 }
export default useService