"use client";

import { Icon } from "@/assets/icons/Icon";

import type { EquipmentReturnType } from "@/types";
import { cn } from "@/utils";
import { Grid, Group, Radio } from "@mantine/core";

type Props = {
  defaultEquipment?: string;
  equipments: EquipmentReturnType[];
  onChange?: (value: string) => void;
};

export const EquipmentSelectContainer = ({
  defaultEquipment,
  equipments,
  onChange,
}: Props) => {
  return (
    <Radio.Group
      defaultValue={defaultEquipment ?? equipments?.[0]?.id}
      onChange={(e) => {
        onChange?.(e);
      }}
      className="py-5"
    >
      <Grid className="gap-2">
        {equipments?.map((equipment) => (
          <Grid.Col key={equipment?.id} span={6}>
            <Radio
              color="var(--color-primary)"
              value={equipment?.id}
              label={
                <Group align="center">
                  <Icon
                    html={equipment?.icon}
                    className={cn("flex items-center text-primary", {
                      "mx-2 h-4 w-4": equipment?.name === "Bodyweight",
                      "mx-1 h-6 w-6": [
                        "Kettlebells",
                        "Plate",
                        "Vitruvian",
                      ].includes(equipment?.name),
                      "[&_svg]:h-8 [&_svg]:w-8": equipment?.name === "Cardio",
                    })}
                  />
                  {equipment?.name}
                </Group>
              }
              classNames={{
                body: "items-center",
              }}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Radio.Group>
  );
};
