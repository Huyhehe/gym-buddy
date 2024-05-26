"use client";

import { cn } from "@/utils";
import { Group, Switch, rem } from "@mantine/core";
import { IconGenderFemme, IconGenderMale } from "@tabler/icons-react";
import { useState } from "react";

export const GenderToggler = () => {
  const [isFemale, setIsFemale] = useState(false);
  return (
    <Group align="center">
      <span>Male</span>
      <Switch
        checked={isFemale}
        onChange={(e) => setIsFemale(e.target.checked)}
        size="md"
        color="pink"
        classNames={{
          track: cn("border-2 border-white bg-primary", {
            "bg-pink": isFemale,
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
      <span>Female</span>
    </Group>
  );
};
