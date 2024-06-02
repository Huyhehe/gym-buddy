"use client";
import { Button, Stack } from "@mantine/core";
import { useWorkoutBuilderFormContext } from "../_context";

type TFitnessLevel = {
  label: string;
  value: number;
};

const fitnessLevels: TFitnessLevel[] = [
  {
    label: "Chưa tập bao giờ",
    value: 1,
  },
  {
    label: "Mới tập gần đây",
    value: 2,
  },
  {
    label: "Đã tập khá lâu",
    value: 3,
  },
  {
    label: "Nhiều kinh nghiệm tập luyện",
    value: 4,
  },
];
export const FitnessLevelButtonGroup = () => {
  const { values, setFieldValue } = useWorkoutBuilderFormContext();
  return (
    <>
      <h1 className="text-3xl font-bold uppercase text-primary">
        {"việc tập gym đối với bạn như thế nào?"}
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
