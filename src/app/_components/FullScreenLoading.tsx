"use client";

import { LoadingOverlay } from "@mantine/core";
import { AnimatedLogo } from "./AnimatedLogo";

export const FullScreenLoading = () => {
  return (
    <LoadingOverlay
      visible={true}
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
  );
};
