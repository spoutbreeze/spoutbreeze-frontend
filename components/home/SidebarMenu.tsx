import Image from "next/image";
import React, { JSX } from "react";

export interface MenuItem {
  key: string;
  label: string;
  icon: string;
  component: JSX.Element;
}

interface SidebarMenuProps {
  menuItems: MenuItem[];
  activeKey: string;
  onMenuItemClick: (key: string) => void;
}

const SideBar: React.FC<SidebarMenuProps> = ({
  menuItems,
  activeKey,
  onMenuItemClick,
}) => {
  return (
    <div className="flex flex-col bg-white rounded-[10px] overflow-hidden">
      {menuItems.map((item, index) => (
        <button
          key={item.key}
          className={`
            flex items-center py-[15px] pl-[15px] cursor-pointer w-full
            ${activeKey === item.key ? "bg-[#2686BE]/10" : ""}
            ${index === 0 ? "rounded-t-[10px]" : ""}
            ${index === menuItems.length - 1 ? "rounded-b-[10px]" : ""}
          `}
          onClick={() => onMenuItemClick(item.key)}
        >
          <Image
            src={item.icon}
            alt={item.label}
            width={12}
            height={12}
            className="w-6 h-6 mr-2"
          />
          <span className="text-[#262262] text-[13px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SideBar;
