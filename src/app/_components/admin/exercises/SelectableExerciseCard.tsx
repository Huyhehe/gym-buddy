"use client";

import type { ExerciseReturnType } from "@/types";

import {
  generateLevelText,
  generateMuscleState,
  generateRepUnitText,
  getMechanicLabel,
} from "@/utils";
import {
  Box,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Overlay,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import { LevelBadge } from "../../LevelBadge";
import { ToggleSkeleton } from "../../MuscleSkeleton/ToggleSkeleton";
import { MuscleAffectLevelContainer } from "../../MuscleAffectLevelContainer";

type Props = {
  exercise: ExerciseReturnType;
  initialSelected?: boolean;
  onSelect?: (exercise: ExerciseReturnType, selected: boolean) => void;
};

export const SelectableExerciseCard = ({
  initialSelected = false,
  exercise,
  onSelect,
}: Props) => {
  const [view, { open: openView, close: closeView }] = useDisclosure(false);
  const [selected, { toggle }] = useDisclosure(initialSelected);

  return (
    <>
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
          <ToggleSkeleton
            key={exercise.id}
            viewMode
            className="flex w-[200px] py-4"
            initialDataForViewMode={generateMuscleState(
              exercise.ExerciseMuscleTarget,
            )}
          />
        </Card.Section>
        <Group justify="space-between" mt="md" mb="xs" wrap="nowrap">
          <Text fw={500} className="line-clamp-1">
            {exercise.name}
          </Text>
          <LevelBadge level={exercise.difficulty} />
        </Group>

        <Group gap={16}>
          <Text size="sm" c="dimmed" className="capitalize">
            {getMechanicLabel(exercise.mechanic)}
          </Text>
          {/* <Text size="sm" c="dimmed" className="capitalize">
            {exercise.difficulty}
          </Text> */}
          <Text size="sm" c="dimmed" className="capitalize">
            {exercise.force}
          </Text>
        </Group>

        <Button
          className="bg-primary"
          fullWidth
          mt="md"
          radius="md"
          onClick={(e) => {
            e.stopPropagation();
            openView();
          }}
        >
          Xem bài tập
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
      <Modal
        opened={view}
        onClose={closeView}
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
              Độ khó
            </Text>
            <Text size="sm" c="dimmed" className="capitalize">
              {generateLevelText(exercise.difficulty)}
            </Text>
          </Box>
          <Divider className="w-full" />
          <Box display="flex" className="w-full gap-8 py-4">
            <Text size="sm" className="w-24">
              Thời lượng
            </Text>
            <Text size="sm" c="dimmed" className="capitalize">
              {exercise.sets}x{exercise.reps}{" "}
              {generateRepUnitText(exercise.repsUnit)}
            </Text>
          </Box>
          <Divider className="w-full" />
          <Box display="flex" className="w-full gap-8 py-4">
            <Text size="sm" className="w-24">
              Lực
            </Text>
            <Text size="sm" c="dimmed" className="capitalize">
              {exercise.force}
            </Text>
          </Box>
          <Divider className="w-full" />
          <Box display="flex" className="w-full gap-8 py-4">
            <Text size="sm" className="w-24">
              Dạng
            </Text>
            <Text size="sm" c="dimmed" className="capitalize">
              {getMechanicLabel(exercise.mechanic)}
            </Text>
          </Box>
          <Divider className="w-full" />
          <Box display="flex" className="w-full gap-8 py-4">
            <Text size="sm" className="w-24">
              Calo tiêu hao
            </Text>
            <Text size="sm" c="dimmed" className="capitalize">
              {exercise.caloriesBurned}
            </Text>
          </Box>
        </Group>
      </Modal>
    </>
  );
};
