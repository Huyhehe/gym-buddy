"use client";

import type { ExerciseReturnType } from "@/types";
import { ToggleBackMale } from "@/app/_components/MuscleSkeleton/ToggleBackMale";
import { ToggleFrontMale } from "@/app/_components/MuscleSkeleton/ToggleFrontMale";

import { Button, Card, Group, Overlay, Text } from "@mantine/core";
import { LevelBadge } from "../../LevelBadge";
import { useDisclosure } from "@mantine/hooks";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { generateMuscleState } from "@/utils";

type Props = {
  exercise: ExerciseReturnType;
  onSelect?: (exercise: ExerciseReturnType, selected: boolean) => void;
};

export const SelectableExerciseCard = ({ exercise, onSelect }: Props) => {
  const [selected, { toggle }] = useDisclosure();

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      pos="relative"
      className="cursor-pointer"
      withBorder
      onClick={() => {
        if (selected) {
          onSelect?.(exercise, false);
        } else {
          onSelect?.(exercise, true);
        }
        toggle();
      }}
    >
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
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        View Exercise
      </Button>
      {selected && (
        <Overlay
          color="#fff"
          backgroundOpacity={0.55}
          blur={2}
          className="flex items-center justify-center"
        >
          <IconCircleCheckFilled size={80} className="text-green-500" />
        </Overlay>
      )}
    </Card>
  );
};
