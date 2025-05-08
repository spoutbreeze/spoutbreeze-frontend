"use client";

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import SideBar from "./SidebarMenu";
import ContentDisplay from "./ContentDisplay";
import { MenuItem } from "./SidebarMenu";
import Channels from "./channelsPage/Channels";
import Recordings from "./RecordingsPage/Recordings";
import Dashboard from "./dashboardPage/Dashboard";
import Endpoints from "./endpointsPage/Endpoints";
import { useRouter, useSearchParams } from "next/navigation";

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

const MainPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get section from URL or default to dashboard
  const section = searchParams.get("section") || "dashboard";

  // Validate section and get the correct component
  const isValidSection = menuItems.some((item) => item.key === section);
  const activeSection = isValidSection ? section : "dashboard";

  // Set the active component based on section
  const [activeComponent, setActiveComponent] = useState(activeSection);

  // Handle component changes when URL changes
  useEffect(() => {
    // Only update state if section is valid
    if (isValidSection) {
      setActiveComponent(section);
    } else if (section !== "dashboard") {
      // Redirect if section is invalid (and not already dashboard)
      router.replace("?section=dashboard");
    }
  }, [section, isValidSection, router]);

  // Update the URL when menu item is clicked
  const handleMenuItemClick = (key: string) => {
    setActiveComponent(key);
    router.push(`?section=${key}`);
  };

  // Find the current component to display
  const currentComponent = menuItems.find(
    (item) => item.key === activeComponent
  )?.component;

  return (
    <section className="bg-[#F6F6F6] min-h-screen pb-10">
      <Box sx={{ flexGrow: 1 }} className="px-[100px] pt-[80px]">
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 2 }}>
            <SideBar
              menuItems={menuItems}
              activeKey={activeComponent}
              onMenuItemClick={handleMenuItemClick}
            />
          </Grid>
          <Grid size={{ xs: 10 }}>
            <Box className="bg-white rounded-[10px] h-full">
              <ContentDisplay component={currentComponent || <Dashboard />} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </section>
  );
};

export default MainPage;
