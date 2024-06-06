"use client";

import { cn } from "@/utils";
import { IconBrandArc } from "@tabler/icons-react";

type Props = {
  className?: string;
  size?: number;
};

export const AnimatedLogo = ({ className, size = 64 }: Props) => {
  return (
    <IconBrandArc
      size={size}
      className={cn("logo-animated text-primary", className)}
    />
  );
};
