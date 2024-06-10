"use client";

import { Button, Stack, Stepper } from "@mantine/core";
import { AgeSelector } from "./_components/AgeSelector";
import { FitnessLevelButtonGroup } from "./_components/FitnessLevelButtonGroup";
import { GenderButtonGroup } from "./_components/GenderButtonGroup";
import { GoalButtonGroup } from "./_components/GoalButtonGroup";
import {
  WorkoutBuilderFormProvider,
  useWorkoutBuilderForm,
  useWorkoutBuilderFormContext,
} from "./_context";

import { api } from "@/trpc/react";
import {
  IconBarbell,
  IconBolt,
  IconCake,
  IconGenderBigender,
  IconTargetArrow,
} from "@tabler/icons-react";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEffect } from "react";
import { GeneratedWorkoutForm } from "./_components/GeneratedWorkoutForm";
import { MuscleTarget } from "./_components/MuscleTarget";
import {
  workoutBuilderSchema,
  type TWorkoutBuilderFormValues,
} from "./_schemas";
import { FormPartWrapper } from "./_components/FormPartWrapper";

const CompleteStepPage = ({ generate }: { generate: () => void }) => {
  const { errors, setFieldValue } = useWorkoutBuilderFormContext();
  const notDoneYet = !!Object.keys(errors).length;

  useEffect(() => {
    if (notDoneYet) return;
    generate();
  }, []);

  if (notDoneYet)
    return (
      <Stack align="center">
        Please go back to complete the survey
        <Button
          onClick={() => setFieldValue("currentStep", 0)}
          color="var(--color-primary)"
        >
          Go back
        </Button>
      </Stack>
    );

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
      muscleTarget: [],
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
      <div className="p-6 @container/generate-workout">
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
              classNames={{
                stepBody: "hidden @3xl/generate-workout:block",
              }}
            >
              <Stepper.Step
                label="Giới tính"
                allowStepSelect
                icon={<IconGenderBigender />}
                completedIcon={<IconGenderBigender />}
              >
                <FormPartWrapper title="giới tính của bạn là gì?">
                  <GenderButtonGroup />
                </FormPartWrapper>
              </Stepper.Step>
              <Stepper.Step
                label="Tuổi tác"
                allowStepSelect
                icon={<IconCake />}
                completedIcon={<IconCake />}
              >
                <FormPartWrapper title="Tuổi tác">
                  <AgeSelector />
                </FormPartWrapper>
              </Stepper.Step>
              <Stepper.Step
                label="Mục tiêu"
                allowStepSelect
                icon={<IconTargetArrow />}
                completedIcon={<IconTargetArrow />}
              >
                <FormPartWrapper title="mục tiêu tập luyện của bạn là gì?">
                  <GoalButtonGroup />
                </FormPartWrapper>
              </Stepper.Step>
              <Stepper.Step
                label="Cấp độ"
                allowStepSelect
                icon={<IconBolt />}
                completedIcon={<IconBolt />}
              >
                <FormPartWrapper title="việc tập gym đối với bạn như thế nào?">
                  <FitnessLevelButtonGroup />
                </FormPartWrapper>
              </Stepper.Step>
              <Stepper.Step
                label="Nhóm cơ"
                allowStepSelect
                icon={<IconBarbell />}
                completedIcon={<IconBarbell />}
              >
                <FormPartWrapper
                  title="bạn muốn tập nhóm cơ nào?"
                  classNames={{
                    main: "@4xl/generate-workout:px-0",
                  }}
                >
                  <MuscleTarget female={!workoutBuilderForm.values.gender} />
                </FormPartWrapper>
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
