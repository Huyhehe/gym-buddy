"use client";
import { Button, Stack } from "@mantine/core";
import { useWorkoutBuilderFormContext } from "../_context";

type TGoal = {
  label: string;
  value: "lose" | "strength" | "muscle";
};

const goals: TGoal[] = [
  {
    label: "Lose Weight",
    value: "lose",
  },
  {
    label: "Gain Strength",
    value: "strength",
  },
  {
    label: "Gain Muscle",
    value: "muscle",
  },
];

export const GoalButtonGroup = () => {
  const { values, setFieldValue } = useWorkoutBuilderFormContext();
  return (
    <>
      <h1 className="text-3xl font-bold uppercase text-primary">
        {"YOUR FITNESS GOAL?"}
      </h1>
      <Stack className="box-content gap-4 px-[20%]">
        {goals.map((goal) => (
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
    </>
  );
};