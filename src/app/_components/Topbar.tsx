"use client";

import { Avatar, Button, Menu, rem } from "@mantine/core";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LoginModal } from "./LoginModal";
import { useDisclosure } from "@mantine/hooks";

interface Props {
  session?: Session | null;
}

export const Topbar = ({ session }: Props) => {
  const [loginModalOpened, { close: loginModalClose, open: loginModalOpen }] =
    useDisclosure();
  return (
    <div className="flex items-center bg-white px-5 py-1">
      <div></div>
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
                Profile
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
                Logout
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
