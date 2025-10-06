import type { Ride } from "../../../shared/types";
import http from "../../../shared/Utils/http";

async function getCoordinates(address: string): Promise<any | null> {
    try {
        const response = await http.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`)
        if(response) return response
        else return null
    } catch (error) {
        console.log(error)
    }
}

async function placesAutocompletion(query: string, options?: { signal: AbortSignal }): Promise<any | null> {
    try {
        const response = await http.get(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(
          query
        )}`,options)
        if(response) return response
        else return null
    } catch (error) {
        throw new Error('Nominating API Error')
    }
}

async function createDelivery(payload: Ride) {
    try {
        const { data } = await http.post('/AdminUser/assign',payload)
        return data
    } catch (error) {
        console.error(error)
    }
}

const HomeServices = { getCoordinates, placesAutocompletion, createDelivery }
export default HomeServices