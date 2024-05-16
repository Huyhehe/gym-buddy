"use client";

import { Breadcrumbs, type BreadcrumbsProps } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import clsx from "clsx";

export type BreadcrumbsItem = {
  label: string;
  href: string;
};

type Props = Omit<BreadcrumbsProps, "children">;

function transformPathToArray(path: string) {
  // Split the path into parts
  const parts = path.split("/").filter((part) => part); // filter to remove any empty strings

  // Initialize an empty array to hold the result
  const result: BreadcrumbsItem[] = [];

  // Initialize a variable to keep track of the href
  let currentHref = "";

  // Loop through each part and build the result array
  parts.forEach((part) => {
    // Append the current part to the href
    currentHref += "/" + part;

    // Capitalize the first letter of the label
    const label = part.charAt(0).toUpperCase() + part.slice(1);

    // Push the object to the result array
    result.push({
      href: currentHref,
      label: label,
    });
  });

  return result;
}

export const MyBreadcrumbs = ({ ...props }: Props) => {
  const path = usePathname();
  const items = useMemo(() => transformPathToArray(path), [path]);
  return (
    <Breadcrumbs {...props}>
      {items.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={clsx("text-blue-500", {
            "font-bold": href === path,
          })}
        >
          {label}
        </Link>
      ))}
    </Breadcrumbs>
  );
};
