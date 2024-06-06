"use client";

import { cn } from "@/utils";
import { Group, Switch, rem } from "@mantine/core";
import { IconGenderFemme, IconGenderMale } from "@tabler/icons-react";

import { useGlobalContext } from "../workouts/workout-builder/_context/global-context";

export const GenderToggler = () => {
  const { isMale, toggleGender } = useGlobalContext();
  return (
    <Group align="center">
      <span>Nam</span>
      <Switch
        checked={!isMale}
        onChange={toggleGender}
        size="md"
        color="pink"
        classNames={{
          track: cn("border-2 border-white bg-primary cursor-pointer", {
            "bg-pink": !isMale,
          }),
        }}
        offLabel={
          <IconGenderMale
            style={{ width: rem(16), height: rem(16) }}
            stroke={2.5}
            color="white"
          />
        }
        onLabel={
          <IconGenderFemme
            style={{ width: rem(16), height: rem(16) }}
            stroke={2.5}
            color="white"
          />
        }
      />
      <span>Nữ</span>
    </Group>
  );
};
