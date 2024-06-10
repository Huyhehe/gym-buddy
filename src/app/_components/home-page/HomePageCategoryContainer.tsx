"use client";

import { Card, CardSection, Divider } from "@mantine/core";
import { EquipmentSelectContainer } from "./EquipmentSelectContainer";

import { useHomePageClientContext } from "./HomePageClientContextProvider";
import { GenderToggler } from "../GenderToggler";
import { cn } from "@/utils";
import { HomePageNavigateSkeletons } from "./HomePageNavigateSkeletons";

type Props = {
  className?: string;
};

export const HomePageCategoryContainer = ({ className }: Props) => {
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
      className={cn(className)}
    >
      <Card.Section className="bg-primary p-4 text-white">
        <GenderToggler />
      </Card.Section>

      <EquipmentSelectContainer
        equipments={equipments}
        onChange={(value) => handleEquipmentChange(value)}
      />

      <CardSection>
        <Divider my="xs" />
      </CardSection>

      <HomePageNavigateSkeletons
        className="flex justify-center @4xl:hidden"
        classNames={{
          skeleton: "w-1/2",
        }}
      />
    </Card>
  );
};
