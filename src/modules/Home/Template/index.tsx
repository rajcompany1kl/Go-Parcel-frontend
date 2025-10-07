import DashboardLayout from "../../../app/layout/DashboardLayout"
import Map from "../Components/Map"

const HomeTemplate = () => {
  

  return (
    <DashboardLayout>
      <div className="w-full h-full flex justify-center items-center ">
        <Map />
      </div>
    </DashboardLayout>
  )
}

export default HomeTemplate