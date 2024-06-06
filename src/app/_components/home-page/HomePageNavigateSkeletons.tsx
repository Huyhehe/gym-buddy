"use client";

import { Group } from "@mantine/core";

import { HomePageBackMale } from "./HomePageBackMale";
import { HomePageFrontMale } from "./HomePageFrontMale";

export const HomePageNavigateSkeletons = () => {
  return (
    <Group className="grow" justify="center">
      <HomePageFrontMale />
      <HomePageBackMale />
    </Group>
  );
};
