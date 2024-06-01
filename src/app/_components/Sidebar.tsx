"use client";

import { cn, compareString, sidebarLinks as links } from "@/utils";
import { Accordion, Burger, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import {
  IconBrandArc,
  IconChevronDown,
  IconUserCog,
} from "@tabler/icons-react";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

interface Props {
  session?: Session | null;
}

export const Sidebar = ({ session }: Props) => {
  const [opened, { toggle, open }] = useDisclosure();
  const [accordionValue, setAccordionValue] = useState<string[]>([]);

  const pathname = usePathname();

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
      className="group sticky top-0 flex w-[90px] flex-col items-stretch gap-5 bg-primary px-2 transition-all duration-300 ease-in-out aria-expanded:w-[280px]"
    >
      <div className="flex w-full items-center justify-center group-aria-expanded:justify-between group-aria-expanded:px-5">
        <IconBrandArc
          color="white"
          className="w-0 group-aria-expanded:w-8 group-aria-expanded:transition-all group-aria-expanded:delay-100 group-aria-expanded:duration-300 group-aria-expanded:ease-in-out"
        />

        <Text className="text-[0px] text-white group-aria-expanded:text-lg group-aria-expanded:transition-all group-aria-expanded:delay-100 group-aria-expanded:duration-300 group-aria-expanded:ease-in-out">
          Gym Buddy
        </Text>

        <Burger
          opened={opened}
          onClick={() => {
            toggle();
            if (opened) {
              setAccordionValue([]);
            }
          }}
          aria-label="Toggle navigation"
          color="white"
          className="my-3 group-aria-expanded:ml-auto"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <Accordion
          chevron={opened ? <IconChevronDown className="text-white" /> : null}
          className="w-full"
          multiple
          value={accordionValue}
          onChange={setAccordionValue}
        >
          {sidebarLinks.map((link) =>
            !!link.subLinks?.length ? (
              <div
                key={link.href}
                className="flex w-full flex-col items-center text-white"
              >
                <Accordion.Item
                  value={link.href}
                  className="w-full border-none"
                >
                  <Accordion.Control
                    onClick={() => {
                      if (opened) return;
                      open();
                    }}
                    className={cn(
                      "flex w-full justify-center rounded-lg hover:bg-primary-dark",
                    )}
                    classNames={{
                      chevron: !opened ? "hidden" : "",
                    }}
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
                        className="flex flex-col rounded-lg text-white transition-all hover:bg-primary-dark data-[active=true]:bg-white data-[active=true]:text-primary"
                      >
                        <Text size="sm" className="px-8 py-3">
                          {subLink.title}
                        </Text>
                      </Link>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item>
                {!opened && (
                  <Text size="xs" ta="center">
                    {link.title}
                  </Text>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="flex w-full flex-col items-center text-white"
              >
                <div
                  data-active={compareString(pathname, link.href)}
                  className="flex w-full justify-center gap-2 rounded-md p-3 transition-all hover:bg-primary-dark group-aria-expanded:justify-start data-[active=true]:bg-white data-[active=true]:text-primary"
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
        </Accordion>
      </div>
    </div>
  );
};
