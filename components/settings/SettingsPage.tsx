"use client";

import React, { useEffect, useState } from "react";
import PageLayout, { PageItem } from "../common/PageLayout";
import SettingsSidebar from "./SettingsSidebar";
import DeleteAccount from "./deleteAccount/DeleteAccount";
import AccountInfo from "./accountInfo/AccountInfo";
import PasswordSettings from "./password/PasswordSettings";
import AccessControl from "./accessControl/AccessControl";
import { fetchCurrentUser, User, isAdmin } from "@/actions/fetchUsers";

const SettingsPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const baseItems: PageItem[] = [
    {
      key: "account info",
      label: "Account Info",
      icon: "/sidebar/account_info_icon.svg",
      component: <AccountInfo />,
    },
    {
      key: "password",
      label: "Password",
      icon: "/sidebar/password_icon.svg",
      component: <PasswordSettings />,
    },
  ];

  // Add Access Control section only for admin users
  const adminItems: PageItem[] = user && isAdmin(user) ? [
    {
      key: "access control",
      label: "Access Control",
      icon: "/sidebar/accessControl_icon.svg",
      component: <AccessControl />,
    },
  ] : [];

  const settingsItems: PageItem[] = [
    ...baseItems,
    ...adminItems,
    {
      key: "delete account",
      label: "Delete Account",
      icon: "/delete_icon_outlined.svg",
      component: <DeleteAccount />,
    },
  ];

  return (
    <PageLayout
      items={settingsItems}
      defaultSection="account info"
      sectionParam="tab"
      sidebarComponent={SettingsSidebar}
    />
  );
};

export default SettingsPage;
