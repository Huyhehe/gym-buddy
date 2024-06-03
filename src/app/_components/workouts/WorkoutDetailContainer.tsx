"use client";

import type { SingleWorkoutReturnType } from "@/types";
import Medal from "@/assets/images/medal.png";
import { ProgressWithButton } from "../ProgressWithButton";
import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { cn, generateMuscleState } from "@/utils";
import { ToggleFrontMale } from "../MuscleSkeleton/ToggleFrontMale";
import { ToggleBackMale } from "../MuscleSkeleton/ToggleBackMale";
import { MuscleAffectLevelContainer } from "../MuscleAffectLevelContainer";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import { api } from "@/trpc/react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

type WorkoutExerciseStep =
  | NonNullable<
      NonNullable<SingleWorkoutReturnType>["WorkoutExerciseStep"]
    >[number]
  | null
  | undefined;

type Props = {
  workout: NonNullable<SingleWorkoutReturnType>;
  isTraining?: boolean;
  userWorkoutId?: string;
};

export const WorkoutDetailContainer = ({
  workout,
  isTraining = false,
  userWorkoutId,
}: Props) => {
  const [
    finishModalOpened,
    { open: openFinishModal, close: closeFinishModal },
  ] = useDisclosure(false);

  const router = useRouter();
  const { mutate: saveWorkoutRecord, isPending: saveWorkoutRecordLoading } =
    api.user.saveWorkoutRecord.useMutation({
      onSuccess: () => {
        notifications.show({
          title: "Workout saved",
          message: "Workout has been saved successfully",
          color: "green",
        });
        void router.push("/workouts/my-workouts");
      },
      onError: (error) => {
        notifications.show({
          title: "Can't save workout",
          message: error.message,
          color: "red",
        });
      },
    });

  const step = useMemo(
    () => 100 / workout.WorkoutExerciseStep.length,
    [workout.WorkoutExerciseStep.length],
  );
  const [progress, setProgress] = useState(step);

  const currentExerciseStep: WorkoutExerciseStep = useMemo(() => {
    const indexByStep = Math.round(progress / step);
    return workout.WorkoutExerciseStep?.[indexByStep - 1];
  }, [progress, step, workout.WorkoutExerciseStep]);

  return (
    <div>
      <Group wrap="nowrap" align="start">
        <Stack className="shrink grow" gap={16}>
          <Stack gap={2} className="rounded-lg bg-white p-4">
            <p className="m-0 text-center font-bold">
              {currentExerciseStep?.exercise.sets}x
              {currentExerciseStep?.exercise.reps} Reps
            </p>
            <ProgressWithButton
              classes={{
                progress: "w-full",
              }}
              step={step}
              outerProgress={progress}
              setOuterProgress={(value) => {
                if (Math.round(value) < Math.round(step)) return;
                setProgress(value);
              }}
            />
            <Group className="flex-nowrap justify-between px-16">
              {workout.WorkoutExerciseStep.map((exerciseStep, index) => (
                <button
                  key={index}
                  style={{ width: `${step}%` }}
                  onClick={() => setProgress((exerciseStep.index + 1) * step)}
                  className={cn({
                    "font-bold text-primary":
                      exerciseStep.index * step < progress,
                  })}
                >
                  {exerciseStep.exercise.name}
                </button>
              ))}
            </Group>
          </Stack>

          <Stack gap={2} className="rounded-lg bg-white">
            <Grid>
              {currentExerciseStep?.exercise?.ExerciseExample?.map(
                (example) =>
                  example.gender && (
                    <Grid.Col span={6} key={example?.id}>
                      <video
                        src={example?.mediaURL ?? ""}
                        className="w-full rounded-lg object-cover"
                        autoPlay
                        loop
                        muted
                      />
                    </Grid.Col>
                  ),
              )}
            </Grid>

            <Stack gap={2} className="my-4 -ml-2">
              {currentExerciseStep?.exercise?.ExerciseStep.map(
                (step, index) => (
                  <Group gap={8} key={step.id}>
                    <div className="rounded-full bg-white p-2">
                      <div className="flex aspect-square w-12 items-center justify-center rounded-full bg-primary leading-3 text-white">
                        {index + 1}
                      </div>
                    </div>
                    <span>{step.description}</span>
                  </Group>
                ),
              )}
            </Stack>
          </Stack>
        </Stack>

        <Stack className="w-[24rem] shrink-0">
          <Card className="w-full rounded-lg bg-white">
            <Card.Section className="bg-primary p-4 text-white">
              abc
            </Card.Section>
            <div
              className="flex w-full justify-center py-4"
              key={currentExerciseStep?.exercise.id}
            >
              <ToggleFrontMale
                viewMode
                initialDataForViewMode={
                  generateMuscleState(
                    currentExerciseStep?.exercise.ExerciseMuscleTarget ?? [],
                  ).front
                }
              />
              <ToggleBackMale
                viewMode
                initialDataForViewMode={
                  generateMuscleState(
                    currentExerciseStep?.exercise.ExerciseMuscleTarget ?? [],
                  ).back
                }
              />
            </div>
            <Group gap={0}>
              <Box className="max-w-full">
                <MuscleAffectLevelContainer />
              </Box>
              <Divider className="w-full" />
              <Box display="flex" className="w-full gap-8 py-4">
                <Text size="sm" className="w-24">
                  Difficulty
                </Text>
                <Text size="sm" c="dimmed" className="capitalize">
                  {currentExerciseStep?.exercise.difficulty}
                </Text>
              </Box>
              <Divider className="w-full" />
              <Box display="flex" className="w-full gap-8 py-4">
                <Text size="sm" className="w-24">
                  Duration
                </Text>
                <Text size="sm" c="dimmed" className="capitalize">
                  {currentExerciseStep?.exercise.sets}x
                  {currentExerciseStep?.exercise.reps}
                </Text>
              </Box>
              <Divider className="w-full" />
              <Box display="flex" className="w-full gap-8 py-4">
                <Text size="sm" className="w-24">
                  Force
                </Text>
                <Text size="sm" c="dimmed" className="capitalize">
                  {currentExerciseStep?.exercise.force ?? "-"}
                </Text>
              </Box>
              <Divider className="w-full" />
              <Box display="flex" className="w-full gap-8 py-4">
                <Text size="sm" className="w-24">
                  Mechanic
                </Text>
                <Text size="sm" c="dimmed" className="capitalize">
                  {currentExerciseStep?.exercise.mechanic ?? "-"}
                </Text>
              </Box>
              <Divider className="w-full" />
              <Box display="flex" className="w-full gap-8 py-4">
                <Text size="sm" className="w-24">
                  Calories
                </Text>
                <Text size="sm" c="dimmed" className="capitalize">
                  {currentExerciseStep?.exercise.caloriesBurned}
                </Text>
              </Box>
            </Group>
          </Card>
          {isTraining && (
            <>
              <Button
                disabled={progress !== 100}
                onClick={openFinishModal}
                color="var(--color-primary)"
              >
                Finish
              </Button>
              <Modal
                opened={finishModalOpened}
                onClose={
                  saveWorkoutRecordLoading ? () => null : closeFinishModal
                }
                radius="lg"
              >
                <Modal.Body display="flex" className="flex-col items-center">
                  <Image src={Medal.src} alt="asb" width={200} height={200} />
                  <h1 className="text-center text-xl font-semibold">
                    <strong className="text-2xl">Congratulations!!!</strong>
                    <br /> You have completed the workout!
                  </h1>
                  <span className="text-md mt-4 text-gray-500">
                    Wanna save your result?
                  </span>
                  <Group className="mt-1">
                    <Button
                      disabled={saveWorkoutRecordLoading}
                      onClick={closeFinishModal}
                    >
                      Later
                    </Button>
                    <Button
                      disabled={saveWorkoutRecordLoading}
                      onClick={() =>
                        void saveWorkoutRecord(userWorkoutId ?? "")
                      }
                    >
                      Save now!{" "}
                      {saveWorkoutRecordLoading && (
                        <Loader color="white" size={14} className="ml-2" />
                      )}
                    </Button>
                  </Group>
                </Modal.Body>
              </Modal>
            </>
          )}
        </Stack>
      </Group>
    </div>
  );
};
