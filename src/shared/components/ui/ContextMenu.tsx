import React, { useState, useRef } from 'react';

export enum ContextMenuItemType {
    ITEM = "ITEM",
    SUBMENU = "SUBMENU",
    SEPARATOR = "SEPARATOR",
    PROFILE = "PROFILE"
}

export interface ContextMenuType {
    label: string;
    key: string;
    action?: () => any;
    type: ContextMenuItemType;
    submenu?: ContextMenuType[];
    avatar?: {
        firstName: string;
        lastName: string;
    }
}

interface ContextMenuProps {
    items: ContextMenuType[];
    children: React.ReactNode;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ items, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = window.setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }

    const renderMenuItem = (item: ContextMenuType) => {
        switch (item.type) {
            case ContextMenuItemType.PROFILE:
                return (
                    <div key={item.key} className="flex items-center px-4 py-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg mr-3">
                            {item.avatar && getInitials(item.avatar.firstName, item.avatar.lastName)}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{item.label}</p>
                        </div>
                    </div>
                )
            case ContextMenuItemType.SEPARATOR:
                return <div key={item.key} className="h-px bg-gray-200 my-1" />;

            case ContextMenuItemType.ITEM:
                return (
                    <div
                        key={item.key}
                        onClick={item.action}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md mx-2 my-1 transition-colors duration-150"
                    >
                        {item.label}
                    </div>
                );

            case ContextMenuItemType.SUBMENU:
                // TODO: Implement Submenu here
                return (
                    <div key={item.key} className="px-4 py-2 text-sm text-gray-700">
                        {item.label}
                    </div>
                );

            default:
                return (
                    <div key={item.key} className="px-4 py-2 text-sm text-gray-500">
                        {item.label}
                    </div>
                );
        }
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-xl shadow-2xl z-50 p-2"
                    style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                >
                    {items.map(renderMenuItem)}
                </div>
            )}
        </div>
    );
};

export default ContextMenu;

