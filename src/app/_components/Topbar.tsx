"use client";

import { Avatar, Burger, Button, Drawer, Menu, Text, rem } from "@mantine/core";
import {
  IconBrandArc,
  IconHistory,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LoginModal } from "./LoginModal";
import { useGlobalContext } from "../workouts/workout-builder/_context/global-context";
import { useDisclosure } from "@mantine/hooks";
import { Sidebar } from "./Sidebar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface Props {
  session?: Session | null;
}

export const Topbar = ({ session }: Props) => {
  const { loginModalOpened, loginModalOpen, loginModalClose } =
    useGlobalContext();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure();

  const pathname = usePathname();

  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  return (
    <div className="sticky right-0 top-0 z-30 flex items-center bg-white px-5 py-1 shadow-md">
      <div className="flex items-center">
        <Burger
          opened={drawerOpened}
          onClick={openDrawer}
          aria-label="Toggle navigation"
          color="var(--color-primary)"
          className="@2xl/main:hidden"
        />
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          classNames={{
            header: "bg-primary",
            close: "text-white scale-125 hover:bg-primary",
            body: "bg-primary h-full p-0",
          }}
        >
          <Sidebar
            session={session}
            showHeader={false}
            classNames={{
              root: "aria-expanded:w-full h-full",
            }}
          />
        </Drawer>
        <IconBrandArc color="var(--color-primary)" className="w-8" />

        <Text className="text-lg font-bold uppercase text-primary">
          Gym Buddy
        </Text>
      </div>
      {!!session ? (
        <div className="ml-auto">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <div className="flex cursor-pointer items-center gap-4 rounded-md p-2 hover:bg-slate-200">
                <Avatar
                  src={session?.user?.image ?? null}
                  size="md"
                  alt="User profile"
                  className="rounded-full"
                />
                <span className="pointer-events-none">
                  Chào, <strong>{session?.user?.name}</strong>
                </span>
              </div>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                color="blue"
                leftSection={
                  <IconUser style={{ width: rem(14), height: rem(14) }} />
                }
                component={Link}
                href="/profile"
              >
                Hồ sơ cá nhân
              </Menu.Item>
              <Menu.Item
                color="blue"
                leftSection={
                  <IconHistory style={{ width: rem(14), height: rem(14) }} />
                }
                component={Link}
                href="/profile/history"
              >
                Lịch sử tập luyện
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={
                  <IconLogout style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
              >
                Đăng xuất
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ) : (
        <>
          <Button
            color="var(--color-primary)"
            variant="outline"
            className="ml-auto rounded-lg border-2"
            onClick={loginModalOpen}
          >
            Sign In
          </Button>
          <LoginModal isOpen={loginModalOpened} onClose={loginModalClose} />
        </>
      )}
    </div>
  );
};
