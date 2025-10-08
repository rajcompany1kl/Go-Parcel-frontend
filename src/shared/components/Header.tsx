import { useEffect, useState } from 'react';
import { Person, Ride } from './ui/Icons';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import ContextMenu, { ContextMenuItemType, type ContextMenuType } from './ui/ContextMenu';
import ContextMenuItems from '../constants/ContextMenuData';
import type { AdminUserAccount } from '../types';
import { useMap } from '../hooks/useMap';
import HomeFactory from '../../modules/Home/factory';
import useService from '../hooks/useServices';

const Header = () => {
  const { role, user, logout, adminDeliveries } = useAuth();
  const { setOrigin, setDestination } = useMap()
  const navigate = useNavigate();
  const services = useService()

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

  async function createAdminDeliveriesMenu() {
    if(user) {
      const response = await services.home.getAllDeliveries(user.id)
      const deliveryMenu = HomeFactory.createAdminDeliveriesContextMenuItems(
        response.rides,
        (address: string) => {
          console.log("Start Adress:  ",address)
          setOrigin(address)},
        (address: string) => setDestination(address)
      )
      console.log(deliveryMenu)
      setDeliveriesContextMenu(deliveryMenu)
    }
  }

  useEffect(() => {
    let profileMenuItems: ContextMenuType[] = ContextMenuItems.profile(navigate, logout)
    if (user) {
      const userProfileContextMenuItem = createProfileContextMenuItem(user)
      profileMenuItems.unshift(userProfileContextMenuItem)
    }
    if (role === 'admin') createAdminDeliveriesMenu()
    setProfileContext(profileMenuItems)
  }, [user]);


  return (
    <div className='w-full h-[10vh] bg-black flex justify-around items-center px-10'>
      <div className="flex-1">
        <span className="text-white text-2xl font-medium">Commute</span>
      </div>
      <div className="w-fit h-full flex justify-end items-center gap-x-5">
        <ContextMenu items={deliveriesContextMenu}>
          <div className="w-12 h-12 rounded-lg hover:bg-neutral-800 hover:cursor-pointer flex justify-center items-center">
            <Ride className="w-8 h-8 fill-white" />
          </div>
        </ContextMenu>

        <ContextMenu items={profileContext}>
          <div className="w-12 h-12 rounded-lg hover:bg-neutral-800 hover:cursor-pointer flex justify-center items-center">
            <Person className="w-8 h-8 fill-white" />
          </div>
        </ContextMenu>
      </div>

    </div>
  );
};

export default Header;

