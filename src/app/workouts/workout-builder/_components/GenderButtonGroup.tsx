"use client";
import { Button, Stack } from "@mantine/core";
import { useWorkoutBuilderFormContext } from "../_context";

export const GenderButtonGroup = () => {
  const { values, setFieldValue } = useWorkoutBuilderFormContext();
  return (
    <>
      <h1 className="text-3xl font-bold uppercase text-primary">
        {"Let's get started"}
      </h1>
      <Stack className="box-content gap-4 px-[20%]">
        <Button
          aria-checked={values.gender}
          color="gray"
          className="h-24 text-2xl transition-all duration-200 ease-in-out hover:scale-105 aria-checked:bg-primary"
          onClick={() => {
            setFieldValue("gender", true);
            setFieldValue("currentStep", values.currentStep + 1);
          }}
        >
          Male
        </Button>
        <Button
          aria-checked={!values.gender}
          color="gray"
          className="h-24 text-2xl transition-all duration-200 ease-in-out hover:scale-105 aria-checked:bg-primary"
          onClick={() => {
            setFieldValue("gender", false);
            setFieldValue("currentStep", values.currentStep + 1);
          }}
        >
          Female
        </Button>
      </Stack>
    </>
  );
};
