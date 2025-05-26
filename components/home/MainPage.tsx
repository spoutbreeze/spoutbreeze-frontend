"use client";

import React from "react";
import PageLayout, { PageItem } from "../common/PageLayout";
import SideBar from "./SidebarMenu";
import Channels from "./channelsPage/ChannelsComponent";
import Recordings from "./RecordingsPage/Recordings";
import Dashboard from "./dashboardPage/Dashboard";
import Endpoints from "./endpointsPage/Endpoints";

export interface MenuItem extends PageItem {
  icon: string;
}

const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "/sidebar/dashboard_icon.svg",
    component: <Dashboard />,
  },
  {
    key: "endpoints",
    label: "Endpoints",
    icon: "/sidebar/endpoints_icon.svg",
    component: <Endpoints />,
  },
  {
    key: "channels",
    label: "Channels",
    icon: "/sidebar/channels_icon.svg",
    component: <Channels />,
  },
  {
    key: "recordings",
    label: "Recordings",
    icon: "/sidebar/recordings_icon.svg",
    component: <Recordings />,
  },
];

const HomeSidebar: React.FC<{
  items: PageItem[];
  activeKey: string;
  onItemClick: (key: string) => void;
}> = ({ items, activeKey, onItemClick }) => {
  return (
    <SideBar
      menuItems={items as MenuItem[]}
      activeKey={activeKey}
      onMenuItemClick={onItemClick}
    />
  );
};

const MainPage: React.FC = () => {
  return (
    <PageLayout
      items={menuItems}
      defaultSection="dashboard"
      sidebarComponent={HomeSidebar}
    />
  );
};

export default MainPage;
