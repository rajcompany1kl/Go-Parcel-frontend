import { useEffect, useMemo } from "react"
import DashboardLayout from "../../../app/layout/DashboardLayout"
import useAuth from "../../../shared/hooks/useAuth"
import Map from "../Components/Map"
import useService from "../../../shared/hooks/useServices"
import { io } from "socket.io-client";

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

  const socket = useMemo(() => {
    if (role === "driver") {
      return io("http://localhost:8080", { transports: ["websocket"] });
    }
    return null;
  }, [role]);

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