"use client";

import type {
  ExerciseMuscleTargetReturnType,
  ExerciseReturnType,
} from "@/types";
import { ToggleBackMale } from "@/app/_components/MuscleSkeleton/ToggleBackMale";
import { ToggleFrontMale } from "@/app/_components/MuscleSkeleton/ToggleFrontMale";

import groupBy from "lodash/groupBy";
import { Button, Card, Group, Text } from "@mantine/core";
import { LevelBadge } from "../../LevelBadge";

type Props = {
  exercise: ExerciseReturnType;
};

const generateMuscleState = (
  muscleTargets: ExerciseMuscleTargetReturnType[],
) => {
  const muscleStateGroupObject = groupBy(muscleTargets, "side");
  const front = (
    muscleStateGroupObject.front?.map((muscle) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      [muscle.name]: muscle.affectLevel,
    })) ?? []
  ).reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});
  const back = (
    muscleStateGroupObject.back?.map((muscle) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      [muscle.name]: muscle.affectLevel,
    })) ?? []
  ).reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});

  return {
    front,
    back,
  };
};

export const ExerciseCard = ({ exercise }: Props) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section className="flex justify-center">
        <div className="flex w-[200px] py-4" key={exercise.id}>
          <ToggleFrontMale
            viewMode
            initialDataForViewMode={
              generateMuscleState(exercise.ExerciseMuscleTarget ?? []).front
            }
          />
          <ToggleBackMale
            viewMode
            initialDataForViewMode={
              generateMuscleState(exercise.ExerciseMuscleTarget ?? []).back
            }
          />
        </div>
      </Card.Section>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{exercise.name}</Text>
        <LevelBadge level={exercise.difficulty} />
      </Group>

      <Group gap={16}>
        <Text size="sm" c="dimmed" className="capitalize">
          {exercise.mechanic}
        </Text>
        <Text size="sm" c="dimmed" className="capitalize">
          {exercise.difficulty}
        </Text>
        <Text size="sm" c="dimmed" className="capitalize">
          {exercise.force}
        </Text>
      </Group>

      <Button
        className="bg-primary"
        fullWidth
        mt="md"
        radius="md"
        component="a"
        href={`/admin/exercises/edit/${exercise.id}`}
      >
        Edit Exercise
      </Button>
    </Card>
  );
};
