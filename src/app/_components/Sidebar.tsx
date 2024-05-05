"use client";

import { useDisclosure } from "@mantine/hooks";
import { Accordion, Burger, Text } from "@mantine/core";
import { compareString, sidebarLinks as links } from "@/utils";
import clsx from "clsx";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconChevronDown, IconUserCog } from "@tabler/icons-react";
import type { Session } from "next-auth";
import Image from "next/image";
import { useMemo } from "react";

interface Props {
  session?: Session | null;
}

export const Sidebar = ({ session }: Props) => {
  const [opened, { toggle, open }] = useDisclosure();
  const pathname = usePathname();
  console.log({ session });

  const sidebarLinks = useMemo(() => {
    const newLinks = links.map((link) => {
      if (!!link.adminOnly) {
        return {
          ...link,
          icon: () => <IconUserCog />,
        };
      }
      return link;
    });

    return session?.user?.isAdmin
      ? newLinks
      : newLinks.filter((link) => !link?.adminOnly);
  }, [session?.user?.isAdmin]);

  return (
    <div
      aria-expanded={opened}
      className="bg-primary group flex w-[90px] flex-col items-stretch gap-5 px-2 transition-all duration-300 ease-in-out aria-expanded:w-[280px]"
    >
      <div className="flex w-full items-center justify-center group-aria-expanded:justify-between group-aria-expanded:px-5">
        <Text className="text-[0px] text-white group-aria-expanded:text-lg group-aria-expanded:transition-all group-aria-expanded:delay-100 group-aria-expanded:duration-300 group-aria-expanded:ease-in-out">
          Gym buddy
        </Text>
        <Burger
          opened={opened}
          onClick={toggle}
          aria-label="Toggle navigation"
          color="white"
          className="my-3"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        {sidebarLinks.map((link) =>
          !!link.subLinks?.length ? (
            <div
              key={link.href}
              className="flex w-full flex-col items-center text-white"
            >
              <Accordion
                chevron={
                  opened ? <IconChevronDown className="text-white" /> : null
                }
                className="w-full"
                value={opened ? link.href : null}
              >
                <Accordion.Item value={link.href} className="border-none">
                  <Accordion.Control
                    onClick={() => {
                      if (opened) return;
                      open();
                    }}
                    className={clsx(
                      "hover:bg-primary-dark flex justify-center rounded-lg",
                      {
                        "[&_.mantine-Accordion-chevron]:hidden": !opened,
                      },
                    )}
                  >
                    <div className="flex justify-center gap-2 text-white group-aria-expanded:justify-start">
                      {link.icon?.()}
                      {opened && (
                        <Text
                          component="span"
                          size="sm"
                          className="flex items-center font-bold"
                        >
                          {link.title}
                        </Text>
                      )}
                    </div>
                  </Accordion.Control>
                  <Accordion.Panel className="group-aria-expanded:delay-200">
                    {link.subLinks.map((subLink) => (
                      <Link
                        key={link.href + subLink.href}
                        href={link.href + subLink.href}
                        data-active={compareString(
                          pathname,
                          link.href + subLink.href,
                        )}
                        className="hover:bg-primary-dark data-[active=true]:text-primary flex flex-col rounded-lg text-white transition-all data-[active=true]:bg-white"
                      >
                        <Text size="sm" className="px-8 py-3">
                          {subLink.title}
                        </Text>
                      </Link>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
              {!opened && <Text size="xs">{link.title}</Text>}
            </div>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="flex w-full flex-col items-center text-white"
            >
              <div
                data-active={compareString(pathname, link.href)}
                className="hover:bg-primary-dark data-[active=true]:text-primary flex w-full justify-center gap-2 rounded-md p-3 transition-all group-aria-expanded:justify-start data-[active=true]:bg-white"
              >
                {link.icon?.()}
                {opened && (
                  <Text
                    component="span"
                    size="sm"
                    className="flex items-center font-bold"
                  >
                    {link.title}
                  </Text>
                )}
              </div>
              {!opened && <Text size="xs">{link.title}</Text>}
            </Link>
          ),
        )}
      </div>
      {!!session && (
        <Image
          src={session?.user?.image ?? ""}
          alt="User profile"
          width={50}
          height={50}
          className="rounded-full"
        />
      )}
    </div>
  );
};
