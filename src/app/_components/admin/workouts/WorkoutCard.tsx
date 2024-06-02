"use client";

import type { WorkoutReturnType } from "@/types";
import {
  cn,
  generateColorDifficultyLevel,
  generateLevelText,
  getGoalLabel,
} from "@/utils";
import { Badge, Button, Card, Group, Image, Text } from "@mantine/core";

type Props = {
  workout: WorkoutReturnType;
};
export const WorkoutCard = ({ workout }: Props) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
      <Card.Section
        className={cn("p-4", generateColorDifficultyLevel(workout.level, true))}
      >
        <Text fw={700} fz="lg" className="capitalize text-white">
          {workout.title}
        </Text>
      </Card.Section>
      <Card.Section className="flex justify-center" pos="relative">
        <Group
          className="-left-2 top-2 flex-col items-start"
          pos="absolute"
          gap={2}
        >
          <Badge
            className={cn(
              "capitalize",
              generateColorDifficultyLevel(workout.level, true),
            )}
            radius="md"
          >
            {generateLevelText(workout.level)}
          </Badge>
          <Badge
            className={cn(
              "capitalize",
              generateColorDifficultyLevel(workout.level, true),
            )}
          >
            {getGoalLabel(workout.target)}
          </Badge>
        </Group>
        <Image
          src={workout.thumbnail}
          alt={workout.title}
          fit="cover"
          h={200}
        />
      </Card.Section>

      <Group gap={16}>
        <Text size="sm" c="dimmed" className="mb-2 line-clamp-4 w-full">
          {workout.description || "No description"}
        </Text>
      </Group>

      <Button
        className="mt-auto bg-primary"
        fullWidth
        mt="md"
        radius="md"
        component="a"
        href={`/admin/workouts/edit/${workout.id}`}
      >
        Chỉnh sửa
      </Button>
    </Card>
  );
};
