"use client";

import { Card } from "@mantine/core";
import { EquipmentSelectContainer } from "./EquipmentSelectContainer";

import { useHomePageClientContext } from "./HomePageClientContextProvider";

export const HomePageCategoryContainer = () => {
  const { equipments, setEquipment } = useHomePageClientContext();
  const handleEquipmentChange = (value: string) => {
    setEquipment(value);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="w-[30%]">
      <EquipmentSelectContainer
        equipments={equipments}
        onChange={(value) => handleEquipmentChange(value)}
      />
    </Card>
  );
};
