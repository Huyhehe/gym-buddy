"use client";

import { Icon } from "@/assets/icons/Icon";

import type { EquipmentReturnType } from "@/types";
import { cn } from "@/utils";
import { Grid, Group, Radio } from "@mantine/core";

type Props = {
  defaultEquipment?: string;
  equipments: EquipmentReturnType[];
  onChange?: (value: string) => void;
  className?: string;
};

export const EquipmentSelectContainer = ({
  defaultEquipment,
  equipments,
  onChange,
  className,
}: Props) => {
  return (
    <Radio.Group
      defaultValue={defaultEquipment ?? equipments?.[0]?.id}
      onChange={(e) => {
        onChange?.(e);
      }}
      className={cn("py-5", className)}
    >
      <Grid className="gap-2">
        {equipments?.map((equipment) => (
          <Grid.Col key={equipment?.id} span={6}>
            <Radio
              color="var(--color-primary)"
              value={equipment?.id}
              label={
                <Group align="center" wrap="nowrap">
                  <Icon
                    html={equipment?.icon}
                    className={cn("flex items-center text-primary", {
                      "mx-2 h-4 w-4": ["Bodyweight"].includes(equipment?.name),
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
