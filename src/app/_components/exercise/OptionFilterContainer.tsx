"use client";

import type { EquipmentReturnType } from "@/types";
import { Card, Divider, GridCol, Group } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { EquipmentSelectContainer } from "../home-page/EquipmentSelectContainer";

import { GenderToggler } from "../GenderToggler";
import { ExerciseNavigateBackMale } from "./ExerciseNavigateBackMale";
import { ExerciseNavigateFrontMale } from "./ExerciseNavigateFrontMale";

type Props = {
  equipments: EquipmentReturnType[];
};

export const OptionFilterContainer = ({ equipments }: Props) => {
  const params = useSearchParams();
  const router = useRouter();

  const muscle = params.get("muscle") ?? "";
  const equipment = params.get("equipment") ?? "";

  const handleOnEquipmentChange = (value: string) => {
    void router.push(`/exercise?muscle=${muscle}&equipment=${value}`);
  };

  return (
    <GridCol span={4}>
      <Card radius="md">
        <Card.Section className="bg-primary p-4 text-white">
          <GenderToggler />
        </Card.Section>

        <Group wrap="nowrap" className="mt-4 px-6">
          <ExerciseNavigateFrontMale
            currentMuscle={muscle}
            equipment={equipment}
          />
          <ExerciseNavigateBackMale
            currentMuscle={muscle}
            equipment={equipment}
          />
        </Group>

        <Divider my="xl" />

        <EquipmentSelectContainer
          equipments={equipments}
          defaultEquipment={equipment}
          onChange={handleOnEquipmentChange}
        />
      </Card>
    </GridCol>
  );
};
