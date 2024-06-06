"use client";

import { Card } from "@mantine/core";
import { EquipmentSelectContainer } from "./EquipmentSelectContainer";

import { useHomePageClientContext } from "./HomePageClientContextProvider";
import { GenderToggler } from "../GenderToggler";

export const HomePageCategoryContainer = () => {
  const { equipments, setEquipment } = useHomePageClientContext();
  const handleEquipmentChange = (value: string) => {
    setEquipment(value);
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="w-[40%] @6xl:w-[35%] @[1280px]:xl:w-[30%]"
    >
      <Card.Section className="bg-primary p-4 text-white">
        <GenderToggler />
      </Card.Section>

      <EquipmentSelectContainer
        equipments={equipments}
        onChange={(value) => handleEquipmentChange(value)}
      />
    </Card>
  );
};
