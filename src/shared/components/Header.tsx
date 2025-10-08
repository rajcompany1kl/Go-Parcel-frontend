import { useEffect } from 'react';
import { Person, Ride } from './ui/Icons';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import ContextMenu, { ContextMenuItemType, type ContextMenuType } from './ui/ContextMenu';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  const menuItems: ContextMenuType[] = user ? [
    {
      key: 'profileName',
      label: `${user.firstName} ${user.lastName}`,
      type: ContextMenuItemType.PROFILE,
      avatar: {
        firstName: user.firstName,
        lastName: user.lastName,
      }
    },
    {
      key: 'separator',
      label: '',
      type: ContextMenuItemType.SEPARATOR,
    },
    {
      key: 'logout',
      label: 'Logout',
      action: () => logout((path: string) => navigate(path)),
      type: ContextMenuItemType.ITEM,
    },
  ] : [];

const rides = [
  { id: 1, from: 'Airport', to: 'Downtown', time: '10:30 AM' },
  { id: 2, from: 'City Center', to: 'Station', time: '2:15 PM' },
  { id: 3, from: 'Mall', to: 'Home', time: '7:00 PM' },
];


  const rideMenuItems: ContextMenuType[] = rides.map((ride) => ({
  key: ride.id.toString(),
  label: `${ride.from} → ${ride.to} (${ride.time})`,
  type: ContextMenuItemType.ITEM,
  action: () => console.log(`Open ride ${ride.id}`),
}));


  return (
    <div className='w-full h-[10vh] bg-black flex justify-around items-center px-10'>
      <div className="flex-1">
        <span className="text-white text-2xl font-medium">Commute</span>
      </div>
     <div className="w-fit h-full flex justify-end items-center gap-x-5">
  {/* Rides menu */}
  <ContextMenu items={rideMenuItems}>
    <div className="w-12 h-12 rounded-lg hover:bg-neutral-800 hover:cursor-pointer flex justify-center items-center">
      <Ride className="w-8 h-8 fill-white" />
    </div>
  </ContextMenu>

  {/* User menu */}
  <ContextMenu items={menuItems}>
    <div className="w-12 h-12 rounded-lg hover:bg-neutral-800 hover:cursor-pointer flex justify-center items-center">
      <Person className="w-8 h-8 fill-white" />
    </div>
  </ContextMenu>
</div>

    </div>
  );
};

export default Header;

