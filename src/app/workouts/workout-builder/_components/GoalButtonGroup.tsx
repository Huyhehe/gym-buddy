"use client";
import { Button, Stack } from "@mantine/core";
import { useWorkoutBuilderFormContext } from "../_context";

import { targetOptions as goalOptions } from "@/utils";

export const GoalButtonGroup = () => {
  const { values, setFieldValue } = useWorkoutBuilderFormContext();
  return (
    <Stack className="box-content gap-4">
      {goalOptions.map((goal) => (
        <Button
          key={goal.value}
          aria-checked={values.goal === goal.value}
          color="gray"
          className="h-24 text-2xl transition-all duration-200 ease-in-out hover:scale-105 aria-checked:bg-primary"
          onClick={() => {
            setFieldValue("goal", goal.value);
            setFieldValue("currentStep", values.currentStep + 1);
          }}
        >
          {goal.label}
        </Button>
      ))}
    </Stack>
  );
};
