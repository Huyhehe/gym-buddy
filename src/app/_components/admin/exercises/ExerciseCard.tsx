"use client";

import type { ExerciseReturnType } from "@/types";

import { generateLevelText, generateMuscleState } from "@/utils";
import {
  Box,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LevelBadge } from "../../LevelBadge";
import { MuscleAffectLevelContainer } from "../../MuscleAffectLevelContainer";
import { ToggleSkeleton } from "../../MuscleSkeleton/ToggleSkeleton";

type Props = {
  exercise: ExerciseReturnType;
};

export const ExerciseCard = ({ exercise }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="cursor-pointer"
        onClick={open}
      >
        <Card.Section className="flex justify-center">
          <ToggleSkeleton
            viewMode
            className="w-[200px] py-4"
            initialDataForViewMode={generateMuscleState(
              exercise.ExerciseMuscleTarget ?? [],
            )}
          />
        </Card.Section>
        <Group
          justify="space-between"
          align="center"
          mt="md"
          mb="xs"
          className="flex-nowrap"
        >
          <Tooltip label={exercise.name}>
            <Text fw={500} className="line-clamp-1 shrink">
              {exercise.name}
            </Text>
          </Tooltip>
          <LevelBadge level={exercise.difficulty} />
        </Group>

        <Group gap={16}>
          <Text size="sm" c="dimmed" className="capitalize">
            {exercise.mechanic}
          </Text>
          <Text size="sm" c="dimmed" className="capitalize">
            {generateLevelText(exercise.difficulty)}
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
          Edit Exercise
        </Button>
      </Card>
      <Modal
        opened={opened}
        onClose={close}
        title={<span className="font-bold">{exercise.name}</span>}
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        transitionProps={{ transition: "skew-up" }}
        radius={12}
      >
        <ToggleSkeleton
          viewMode
          className="w-full justify-center py-4"
          initialDataForViewMode={generateMuscleState(
            exercise.ExerciseMuscleTarget ?? [],
          )}
        />

        <Group gap={0}>
          <MuscleAffectLevelContainer />
          <Divider className="w-full" />
          <Box display="flex" className="w-full gap-8 py-4">
            <Text size="sm" className="w-24">
              Difficulty
            </Text>
            <Text size="sm" c="dimmed" className="capitalize">
              {exercise.difficulty}
            </Text>
          </Box>
          <Divider className="w-full" />
          <Box display="flex" className="w-full gap-8 py-4">
            <Text size="sm" className="w-24">
              Duration
            </Text>
            <Text size="sm" c="dimmed" className="capitalize">
              {exercise.sets}x{exercise.reps}
            </Text>
          </Box>
          <Divider className="w-full" />
          <Box display="flex" className="w-full gap-8 py-4">
            <Text size="sm" className="w-24">
              Force
            </Text>
            <Text size="sm" c="dimmed" className="capitalize">
              {exercise.force}
            </Text>
          </Box>
          <Divider className="w-full" />
          <Box display="flex" className="w-full gap-8 py-4">
            <Text size="sm" className="w-24">
              Mechanic
            </Text>
            <Text size="sm" c="dimmed" className="capitalize">
              {exercise.mechanic}
            </Text>
          </Box>
        </Group>
      </Modal>
    </>
  );
};
