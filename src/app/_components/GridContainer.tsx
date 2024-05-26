"use client";

import { Grid, type GridProps } from "@mantine/core";

export const GridContainer = ({ ...props }: GridProps) => {
  return <Grid {...props}>{props.children}</Grid>;
};
