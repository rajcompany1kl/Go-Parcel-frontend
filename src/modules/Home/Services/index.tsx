import type { Ride, ToastFunction } from "../../../shared/types";
import http from "../../../shared/Utils/http";

const HomeServices = (toast: ToastFunction) => {
    async function getCoordinates(address: string): Promise<any | null> {
        try {
            const response = await http.get(`/api/nominatim/search?q=${encodeURIComponent(address)}`)

            if(response) return response
            else return null
        } catch (error: any) {
            console.error(error);
            toast(error.message, 'error');
            return null;
        }
    }
    
    async function placesAutocompletion(query: string, options?: { signal: AbortSignal }): Promise<any | null> {
        try {
            const response = await http.get(`/api/nominatim/search?q=${encodeURIComponent(query)}`)

            if(response) return response
            else return null
        } catch (error: any) {
            console.error(error);
            toast(error.message, 'error');
            return null;
        }
    }
    
    async function createDelivery(payload: Ride) {
        try {
            const { data } = await http.post('/AdminUser/assign',payload)
            toast("Delivery created successfully!")
            return data
        } catch (error: any) {
            console.error(error);
            toast(error.message,'error');
            return null;
        }
    }
    
    async function getDeliveryDetails(trackingId: string) {
        try {
            const {data} = await http.get(`/DriverUser/getride/${trackingId}`)
            return data
        } catch (error: any) {
            console.error(error);
            toast(error.message,'error');
            return null;
        }
    }
    
    async function getAddressUsingCoords(
        lat: number,
        lng: number
    ) {
        try {
            const { data } = await http.get(`/api/nominatim/reverse?lat=${lat}&lon=${lng}`);
            return data
        } catch (error: any) {
            console.error(error);
            toast(error.message,'error');
            return null;
        }
    }
    
    async function getAllDeliveries(
        adminId: string
    ) {
        try {
            const { data } = await http.get(`/AdminUser/rides/${adminId}`)
            return data
        } catch (error: any) {
            console.error(error);
            toast(error.message,'error');
            return null;
        }
    }

    async function getDriverDelivery(driverId: string) {
        try {
            const { data } = await http.get(`/DriverUser/ride/${driverId}`)
            return data
        } catch (error: any) {
            console.error(error);
            toast(error.message,'error');
            return null;
        }
    }

    async function getAvailableDrivers() {
        try {
            const { data } = await http.get('/DriverUser/availableDrivers')
            return data
        } catch (error: any) {
            console.error(error);
            toast(error.message,'error');
            return null;
        }
    }

    async function endDelivery(driverId: string) {
        try {
            const { data } = await http.post(`/AdminUser/endRide`,{driverId})
            toast("Delivery ended successfully!")
            return data
        } catch (error: any) {
            console.error(error);
            toast(error.message,'error');
            return null;
        }
    }
    return {getCoordinates, placesAutocompletion, createDelivery, getDeliveryDetails, getAddressUsingCoords, getAllDeliveries, getAvailableDrivers, getDriverDelivery, endDelivery}
}
export default HomeServices