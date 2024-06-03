"use client";

import { useGlobalContext } from "@/app/workouts/workout-builder/_context/global-context";
import { LoadingOverlay } from "@mantine/core";
import { IconBrandArc } from "@tabler/icons-react";
import { type PropsWithChildren } from "react";

export default function FunctionalLayout({
  children,
}: PropsWithChildren<object>) {
  const { isBackdropOpen } = useGlobalContext();

  return (
    <div>
      <LoadingOverlay
        visible={isBackdropOpen}
        color="#fff"
        overlayProps={{
          backgroundOpacity: 0.5,
          zIndex: 1000,
          blur: 10,
        }}
        loaderProps={{
          children: <IconBrandArc size={64} className="text-primary" />,
        }}
      />

      {children}
    </div>
  );
}