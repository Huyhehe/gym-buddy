"use client";

import { GridCol, type GridColProps } from "@mantine/core";

export const ExerciseDetailContainer = ({
  children,
  ...props
}: GridColProps) => {
  return <GridCol {...props}>{children}</GridCol>;
};
