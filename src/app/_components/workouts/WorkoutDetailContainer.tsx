"use client";

import type { SingleWorkoutReturnType } from "@/types";
import { ProgressWithButton } from "../ProgressWithButton";
import { useMemo, useState } from "react";
import { Box, Card, Divider, Grid, Group, Stack, Text } from "@mantine/core";
import { cn, generateMuscleState } from "@/utils";
import { ToggleFrontMale } from "../MuscleSkeleton/ToggleFrontMale";
import { ToggleBackMale } from "../MuscleSkeleton/ToggleBackMale";
import { MuscleAffectLevelContainer } from "../MuscleAffectLevelContainer";

type WorkoutExerciseStep =
  | NonNullable<
      NonNullable<SingleWorkoutReturnType>["WorkoutExerciseStep"]
    >[number]
  | null
  | undefined;

type Props = {
  workout: NonNullable<SingleWorkoutReturnType>;
};

export const WorkoutDetailContainer = ({ workout }: Props) => {
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

        <Card className="w-[24rem] shrink-0 rounded-lg bg-white">
          <Card.Section className="bg-primary p-4 text-white">abc</Card.Section>
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
                {currentExerciseStep?.exercise.force}
              </Text>
            </Box>
            <Divider className="w-full" />
            <Box display="flex" className="w-full gap-8 py-4">
              <Text size="sm" className="w-24">
                Mechanic
              </Text>
              <Text size="sm" c="dimmed" className="capitalize">
                {currentExerciseStep?.exercise.mechanic}
              </Text>
            </Box>
          </Group>
        </Card>
      </Group>
    </div>
  );
};
