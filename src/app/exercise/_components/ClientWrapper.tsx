"use client";

import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSettings } from "@tabler/icons-react";
import type { PropsWithChildren } from "react";

export const ClientWrapper = ({ children }: PropsWithChildren<object>) => {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure();
  return (
    <div>
      <div
        className="fixed right-0 top-52 rounded-l-full bg-primary p-2 shadow-md transition-all duration-300 ease-out hover:pr-4 @5xl/workout-detail:hidden"
        onClick={openDrawer}
      >
        <IconSettings size={26} color="white" className="animate-spin" />
      </div>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        classNames={{
          header: "bg-gray-200",
          body: "bg-gray-200 h-max min-h-full",
        }}
      >
        {children}
      </Drawer>
    </div>
  );
};
