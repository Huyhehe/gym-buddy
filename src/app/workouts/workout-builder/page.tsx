"use client";

import { Button, Stepper } from "@mantine/core";
import { AgeSelector } from "./_components/AgeSelector";
import { FitnessLevelButtonGroup } from "./_components/FitnessLevelButtonGroup";
import { GenderButtonGroup } from "./_components/GenderButtonGroup";
import { GoalButtonGroup } from "./_components/GoalButtonGroup";
import { WorkoutBuilderFormProvider, useWorkoutBuilderForm } from "./_context";

import { zodResolver } from "mantine-form-zod-resolver";
import { MuscleTarget } from "./_components/MuscleTarget";
import {
  workoutBuilderSchema,
  type TWorkoutBuilderFormValues,
} from "./_schemas";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { GeneratedWorkoutForm } from "./_components/GeneratedWorkoutForm";

const CompleteStepPage = ({ generate }: { generate: () => void }) => {
  useEffect(() => {
    generate();
  }, []);

  return <div>Workout is being generated, please wait a second...</div>;
};

const WorkoutBuilderPage = () => {
  const {
    mutate: generateWorkout,
    data,
    reset,
  } = api.client.generateWorkout.useMutation();
  const workoutBuilderForm = useWorkoutBuilderForm({
    initialValues: {
      gender: true,
      age: 18,
      goal: "lose",
      currentLevel: 0,
      muscleTarget: {
        front: [],
        back: [],
      },
      currentStep: 0,
    },
    validate: zodResolver(workoutBuilderSchema),
  });

  const handleWorkoutBuilderFormSubmit = (
    values: TWorkoutBuilderFormValues,
  ) => {
    console.log({ values });
    generateWorkout(values);
  };

  console.log({ data });

  const handleRetry = () => {
    workoutBuilderForm.reset();
    reset();
  };

  const handleGenerate = () => {
    generateWorkout(workoutBuilderForm.values);
  };

  return (
    <WorkoutBuilderFormProvider form={workoutBuilderForm}>
      {!data && (
        <form
          onSubmit={workoutBuilderForm.onSubmit(handleWorkoutBuilderFormSubmit)}
        >
          <Stepper
            active={workoutBuilderForm.values.currentStep}
            onStepClick={(step) =>
              workoutBuilderForm.setFieldValue("currentStep", step)
            }
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
            <Stepper.Step label="Muscle target" allowStepSelect>
              <MuscleTarget />
            </Stepper.Step>

            <Stepper.Completed>
              <CompleteStepPage generate={handleGenerate} />
            </Stepper.Completed>
          </Stepper>
        </form>
      )}
      {!!data?.length && (
        <GeneratedWorkoutForm
          exercises={data}
          workoutBuilderFormValues={workoutBuilderForm.values}
        />
      )}
      {!!data && !data.length && (
        <div>
          no data, wanna try again? <Button onClick={handleRetry}>reset</Button>
        </div>
      )}
    </WorkoutBuilderFormProvider>
  );
};

export default WorkoutBuilderPage;
