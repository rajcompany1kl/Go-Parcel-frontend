import { useEffect } from "react"
import DashboardLayout from "../../../app/layout/DashboardLayout"
import useAuth from "../../../shared/hooks/useAuth"
import Map from "../Components/Map"
import useService from "../../../shared/hooks/useServices"
import { useToaster } from "../../../shared/hooks/useToast"
import useSocket from "../../../shared/hooks/useSocket"

const HomeTemplate = () => {
  const { setAdminDeliveries, user, role } = useAuth()
  const toast = useToaster()
  const { socket } = useSocket()
  const services = useService(toast.addToast)

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
        <Map socket={socket ? socket : null} />
      </div>
    </DashboardLayout>
  )
}
                                              
export default HomeTemplate