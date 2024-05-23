"use client";

import { Stepper } from "@mantine/core";
import { AgeSelector } from "./_components/AgeSelector";
import { GenderButtonGroup } from "./_components/GenderButtonGroup";
import { GoalButtonGroup } from "./_components/GoalButtonGroup";
import { WorkoutBuilderFormProvider, useWorkoutBuilderForm } from "./_context";
import { FitnessLevelButtonGroup } from "./_components/FitnessLevelButtonGroup";

const WorkoutBuilderPage = () => {
  const form = useWorkoutBuilderForm({
    initialValues: {
      name: "",
      gender: true,
      age: 18,
      goal: "lose",
      currentLevel: 0,
      muscleTarget: [],
      currentStep: 0,
    },
  });

  console.log({ values: form.values });

  return (
    <WorkoutBuilderFormProvider form={form}>
      <form>
        <Stepper
          active={form.values.currentStep}
          onStepClick={(step) => form.setFieldValue("currentStep", step)}
          color="var(--color-primary)"
        >
          <Stepper.Step label="Gender" allowStepSelect>
            <GenderButtonGroup />
          </Stepper.Step>
          <Stepper.Step label="Birth" allowStepSelect>
            <AgeSelector />
          </Stepper.Step>
          <Stepper.Step label="Your goal" allowStepSelect>
            <GoalButtonGroup />
          </Stepper.Step>
          <Stepper.Step label="Current level" allowStepSelect>
            <FitnessLevelButtonGroup />
          </Stepper.Step>

          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
      </form>
    </WorkoutBuilderFormProvider>
  );
};

export default WorkoutBuilderPage;
