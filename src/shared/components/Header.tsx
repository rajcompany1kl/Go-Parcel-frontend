import { useEffect } from 'react';
import { Person } from './ui/Icons';
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

  return (
    <div className='w-full h-[10vh] bg-black flex justify-around items-center px-10'>
      <div className="flex-1">
        <span className="text-white text-2xl font-medium">Commute</span>
      </div>
      <div className="w-fit h-full flex justify-end items-center gap-x-5">
        <ContextMenu items={menuItems}>
          <div className="w-12 h-12 rounded-lg hover:bg-neutral-800 hover:cursor-pointer flex justify-center items-center">
            <Person className='w-8 h-8 fill-white' />
          </div>
        </ContextMenu>
      </div>
    </div>
  );
};

export default Header;

