"use client";
import { Button, Stack } from "@mantine/core";
import { useWorkoutBuilderFormContext } from "../_context";
import { GENDER_LABEL } from "@/utils";

export const GenderButtonGroup = () => {
  const { values, setFieldValue } = useWorkoutBuilderFormContext();
  return (
    <Stack className="box-content gap-4">
      <Button
        aria-checked={values.gender}
        color="gray"
        className="h-24 text-2xl transition-all duration-200 ease-in-out hover:scale-105 aria-checked:bg-primary"
        onClick={() => {
          setFieldValue("gender", true);
          setFieldValue("currentStep", values.currentStep + 1);
        }}
      >
        {GENDER_LABEL.male}
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
        {GENDER_LABEL.female}
      </Button>
    </Stack>
  );
};
