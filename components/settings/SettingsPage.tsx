"use client";

import React from "react";
import PageLayout, { PageItem } from "../common/PageLayout";
import SettingsSidebar from "./SettingsSidebar";
import DeleteAccount from "./deleteAccount/DeleteAccount";
import AccountInfo from "./accountInfo/AccountInfo";
import PasswordSettings from "./password/PasswordSettings";

const settingsItems: PageItem[] = [
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
  {
    key: "delete account",
    label: "Delete Account",
    icon: "/delete_icon_outlined.svg",
    component: <DeleteAccount />,
  },
];

const SettingsPage: React.FC = () => {
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
