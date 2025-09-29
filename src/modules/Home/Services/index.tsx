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

const HomeServices = { getCoordinates }
export default HomeServices