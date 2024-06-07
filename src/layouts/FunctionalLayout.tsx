"use client";

import { AnimatedLogo } from "@/app/_components/AnimatedLogo";
import { useGlobalContext } from "@/app/workouts/workout-builder/_context/global-context";
import { LoadingOverlay } from "@mantine/core";
import { type PropsWithChildren } from "react";

export default function FunctionalLayout({
  children,
}: PropsWithChildren<object>) {
  const { isBackdropOpen } = useGlobalContext();

  return (
    <div>
      <LoadingOverlay
        className="fixed top-0 h-svh"
        visible={isBackdropOpen}
        color="#fff"
        overlayProps={{
          backgroundOpacity: 0.5,
          zIndex: 1000,
          blur: 10,
        }}
        loaderProps={{
          children: <AnimatedLogo />,
        }}
      />

      {children}
    </div>
  );
}
