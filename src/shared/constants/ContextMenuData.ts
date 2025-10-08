import { ContextMenuItemType, type ContextMenuType } from "../components/ui/ContextMenu";
import type { AdminUserAccount } from "../types";

const profileContextMenuItems: ( 
    navigate: any, 
    logout: any
) => ContextMenuType[] = (
    navigate: any, 
    logout: any
) => [
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
];

const mockRides = [
    { id: 1, from: 'Airport', to: 'Downtown', time: '10:30 AM' },
    { id: 2, from: 'City Center', to: 'Station', time: '2:15 PM' },
    { id: 3, from: 'Mall', to: 'Home', time: '7:00 PM' },
];
const rideMenuItems: () => ContextMenuType[] = () => mockRides.map((ride) => ({
    key: ride.id.toString(),
    label: `${ride.from} → ${ride.to} (${ride.time})`,
    type: ContextMenuItemType.ITEM,
    action: () => console.log(`Open ride ${ride.id}`),
}));


const ContextMenuItems = { profile: profileContextMenuItems, rides: rideMenuItems }
export default ContextMenuItems