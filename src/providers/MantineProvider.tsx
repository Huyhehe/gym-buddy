import {
  createTheme,
  MantineProvider as OriginalMantineProvider,
} from "@mantine/core";
import type { PropsWithChildren } from "react";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export function MantineProvider({ children }: PropsWithChildren<object>) {
  return (
    <OriginalMantineProvider theme={theme}>{children}</OriginalMantineProvider>
  );
}
