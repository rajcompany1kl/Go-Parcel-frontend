import { useEffect } from "react"
import DashboardLayout from "../../../app/layout/DashboardLayout"
import useAuth from "../../../shared/hooks/useAuth"
import Map from "../Components/Map"
import useService from "../../../shared/hooks/useServices"
import HomeFactory from "../factory"

const HomeTemplate = () => {
  const { setAdminDeliveries, user, role } = useAuth()
  const services = useService()

  async function fetchAdminDeliveries() {
    if(user) {
      const response = await services.home.getAllDeliveries(user.id)
      if(response.rides) {
        setAdminDeliveries(response.rides)}
    }
  }

  useEffect(()=>{
    if(role == 'admin') fetchAdminDeliveries()
  },[])

  return (
    <DashboardLayout>
      <div className="w-full h-full flex justify-center items-center ">
        <Map />
      </div>
    </DashboardLayout>
  )
}

export default HomeTemplate