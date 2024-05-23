"use client";
import { Button, Stack } from "@mantine/core";
import { useWorkoutBuilderFormContext } from "../_context";

type TFitnessLevel = {
  label: string;
  value: number;
};

const fitnessLevels: TFitnessLevel[] = [
  {
    label: "Beginner",
    value: 0,
  },
  {
    label: "Intermediate",
    value: 1,
  },
  {
    label: "Advanced",
    value: 2,
  },
];
export const FitnessLevelButtonGroup = () => {
  const { values, setFieldValue } = useWorkoutBuilderFormContext();
  return (
    <>
      <h1 className="text-3xl font-bold uppercase text-primary">
        {"YOUR FITNESS LEVEL?"}
      </h1>
      <Stack className="box-content gap-4 px-[20%]">
        {fitnessLevels.map((fitnessLevel) => (
          <Button
            key={fitnessLevel.value}
            aria-checked={values.currentLevel === fitnessLevel.value}
            color="gray"
            className="h-24 text-2xl transition-all duration-200 ease-in-out hover:scale-105 aria-checked:bg-primary"
            onClick={() => {
              setFieldValue("currentLevel", fitnessLevel.value);
              setFieldValue("currentStep", values.currentStep + 1);
            }}
          >
            {fitnessLevel.label}
          </Button>
        ))}
      </Stack>
    </>
  );
};
