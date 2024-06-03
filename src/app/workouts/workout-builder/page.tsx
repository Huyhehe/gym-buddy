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
      goal: "lose-weight",
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
    generateWorkout(values);
  };

  const handleRetry = () => {
    workoutBuilderForm.reset();
    reset();
  };

  const handleGenerate = () => {
    generateWorkout(workoutBuilderForm.values);
  };

  return (
    <WorkoutBuilderFormProvider form={workoutBuilderForm}>
      <div className="p-6">
        {!data && (
          <form
            onSubmit={workoutBuilderForm.onSubmit(
              handleWorkoutBuilderFormSubmit,
            )}
          >
            <Stepper
              active={workoutBuilderForm.values.currentStep}
              onStepClick={(step) =>
                workoutBuilderForm.setFieldValue("currentStep", step)
              }
              color="var(--color-primary)"
            >
              <Stepper.Step label="Giới tính" allowStepSelect>
                <GenderButtonGroup />
              </Stepper.Step>
              <Stepper.Step label="Tuổi tác" allowStepSelect>
                <AgeSelector />
              </Stepper.Step>
              <Stepper.Step label="Mục tiêu" allowStepSelect>
                <GoalButtonGroup />
              </Stepper.Step>
              <Stepper.Step label="Cấp độ" allowStepSelect>
                <FitnessLevelButtonGroup />
              </Stepper.Step>
              <Stepper.Step label="Nhóm cơ" allowStepSelect>
                <MuscleTarget female={!workoutBuilderForm.values.gender} />
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
            no data, wanna try again?{" "}
            <Button onClick={handleRetry}>reset</Button>
          </div>
        )}
      </div>
    </WorkoutBuilderFormProvider>
  );
};

export default WorkoutBuilderPage;
