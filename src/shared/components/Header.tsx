import { useEffect, useState, type MouseEventHandler } from 'react';
import { Person, RideIcon } from './ui/Icons';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import ContextMenu, { ContextMenuItemType, type ContextMenuType } from './ui/ContextMenu';
import ContextMenuItems from '../constants/ContextMenuData';
import type { AdminUserAccount, Ride } from '../types';
import { useMap } from '../hooks/useMap';
import HomeFactory from '../../modules/Home/factory';
import useService from '../hooks/useServices';
import useSocket from '../hooks/useSocket';
import { useToaster } from '../hooks/useToast';
interface HeaderProps {
  toggleSidebar?: MouseEventHandler<HTMLButtonElement>;
  isSidebarOpen?: boolean;
}


const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {

  
  const { role, user, logout, setDelivery, delivery } = useAuth();
  const { setOriginCoords, setDestinationCoords } = useMap()
  const navigate = useNavigate();
  const toast = useToaster()
  const { socket } = useSocket()
  const services = useService(toast.addToast)

  const [profileContext, setProfileContext] = useState<ContextMenuType[]>([])
  const [deliveriesContextMenu, setDeliveriesContextMenu] = useState<ContextMenuType[]>([])

  function createProfileContextMenuItem(user: AdminUserAccount): ContextMenuType {
    return {
      key: 'profileName',
      label: `${user.firstName} ${user.lastName}`,
      type: ContextMenuItemType.PROFILE,
      avatar: { firstName: user.firstName, lastName: user.lastName }
    }
  }

  useEffect(()=>{
    console.log("header useffect se")
    if (role === 'admin') createAdminDeliveriesMenu(); 
    console.log("deliveries resetting",delivery)
  },[delivery])

  async function createAdminDeliveriesMenu() {
    if (user) {
      console.log("deliveries resetting",delivery)
      const response = await services.home.getAllDeliveries(user.id)
      const activeDeliveries = (response.rides as any[]).filter(ride => (ride as Ride).isRideEnded === false)
      console.log("Active deliveries for admin:", activeDeliveries);
      const deliveryMenu = HomeFactory.createAdminDeliveriesContextMenuItems(
        activeDeliveries,
        (coordinates: [number, number]) => setOriginCoords(coordinates),
        (coordinates: [number, number]) => setDestinationCoords(coordinates),
        (delivery: Ride) => setDelivery(delivery)
      )
      setDeliveriesContextMenu(deliveryMenu)
    }
  }

  useEffect(() => {
    let profileMenuItems: ContextMenuType[] = ContextMenuItems.profile(navigate, logout)
    if (user) {
      const userProfileContextMenuItem = createProfileContextMenuItem(user)
      profileMenuItems.unshift(userProfileContextMenuItem)
    }
    if(user?.id){
    if (role === 'admin'){ 
      console.log("ab aaya pakad mai")
      createAdminDeliveriesMenu()}
    }
    setProfileContext(profileMenuItems)
  }, [user]);

  useEffect(() => {
    socket?.on('driver:location',({driverId, lat, lng}: {driverId: string, lat: number, lng: number}) => {
      if(delivery?.driverId === driverId) {
        setDelivery((prev) => {
          const updatedDelivery = {...prev, lastDriverLocation: {lat: lat, lng: lng}}
          return updatedDelivery
        })
      }
    })
  }, [delivery, socket])


  return (
    <div className='w-full h-[10vh] bg-black flex justify-around items-center pl-10 pr-5'>
      <div className="flex-1">
        <span onClick={() => navigate('/')} className="text-white text-2xl font-medium hover:cursor-pointer">GoParcel</span>
      </div>
      <div className="w-fit h-full flex justify-end items-center gap-x-2 ">
      {(role=='admin') && 
        <ContextMenu items={deliveriesContextMenu}>
          <div className="w-12 h-12 rounded-lg hover:bg-neutral-800 hover:cursor-pointer flex justify-center items-center">
            <RideIcon className="w-8 h-8 fill-white" />
          </div>
        </ContextMenu>
      }

        <ContextMenu items={profileContext}>
          <div className="w-12 h-12 rounded-lg hover:bg-neutral-800 hover:cursor-pointer flex justify-center items-center">
            <Person className="w-8 h-8 fill-white" />
          </div>
        </ContextMenu>
         {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden z-50 p-2 rounded-md bg-black text-white"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

    </div>
  );
};

export default Header;

