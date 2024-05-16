import type { ReactNode } from "react";

export type SidebarSubLinks = {
  title: string;
  href: string;
};

export type SidebarLinks = {
  title: string;
  href: string;
  icon?: () => JSX.Element | ReactNode;
  adminOnly?: boolean;
  subLinks?: SidebarSubLinks[];
};

export type SelectOption = {
  label: string;
  value: string;
};
