"use client";

import { Box, LoadingOverlay } from "@mantine/core";

export const FullScreenLoading = () => {
  return (
    <Box className="min-h-[100svh] min-w-full" pos={"relative"}>
      <LoadingOverlay
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "blue", type: "bars" }}
      />
    </Box>
  );
};
