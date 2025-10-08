import { useEffect, useState } from 'react';
import { Person, Ride } from './ui/Icons';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import ContextMenu, { ContextMenuItemType, type ContextMenuType } from './ui/ContextMenu';
import ContextMenuItems from '../constants/ContextMenuData';
import type { AdminUserAccount } from '../types';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [ profileContext, setProfileContext ] = useState<ContextMenuType[]>([])

  function createProfileContextMenuItem(user: AdminUserAccount): ContextMenuType {
    return {
      key: 'profileName',
      label: `${user.firstName} ${user.lastName}`,
      type: ContextMenuItemType.PROFILE,
      avatar: { firstName: user.firstName, lastName: user.lastName }
    }
  }

  useEffect(() => {
    let profileMenuItems: ContextMenuType[] = ContextMenuItems.profile(navigate, logout)
    
    if (user) {
      const userProfileContextMenuItem = createProfileContextMenuItem(user)
      profileMenuItems.unshift(userProfileContextMenuItem)
    }

    setProfileContext(profileMenuItems)
  }, [user]);
  const rides = ContextMenuItems.rides()


  return (
    <div className='w-full h-[10vh] bg-black flex justify-around items-center px-10'>
      <div className="flex-1">
        <span className="text-white text-2xl font-medium">Commute</span>
      </div>
      <div className="w-fit h-full flex justify-end items-center gap-x-5">
        <ContextMenu items={rides}>
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

