"use client";

import { api } from "@/trpc/react";
import type { WorkoutReturnType } from "@/types";
import { cn, generateColorDifficultyLevel, generateLevelText } from "@/utils";
import { Badge, Card, Group, Image, Text } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type Props = {
  workout: WorkoutReturnType;
};
export const UserViewWorkoutCard = ({ workout }: Props) => {
  const [isBookmarked, setIsBookmarked] = useState(!!workout.isBookmarked);
  const { mutate: bookMarkWorkout } = api.workout.bookMarkWorkout.useMutation();

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { push } = useRouter();

  const handleViewWorkoutDetail = () => {
    push(`/workouts/${workout.id}`);
  };

  const handleBookmarkClick = useCallback(
    debounce((isBookmarked: boolean) => {
      bookMarkWorkout({ workoutId: workout.id, isBookmarked });
    }, 500),
    [],
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="h-full">
      <Card.Section
        className={cn(
          "flex cursor-pointer items-center p-4",
          generateColorDifficultyLevel(workout.level, true),
        )}
        onClick={handleViewWorkoutDetail}
      >
        <Text fw={700} fz="lg" className="mr-auto capitalize text-white">
          {workout.title}
        </Text>
        {isBookmarked ? (
          <IconBookmarkFilled
            className="cursor-pointer text-white transition-all hover:scale-125"
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked(false);
              handleBookmarkClick(false);
            }}
          />
        ) : (
          <IconBookmark
            className="cursor-pointer text-white transition-all hover:scale-125"
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked(true);
              handleBookmarkClick(true);
            }}
          />
        )}
      </Card.Section>
      <Card.Section
        className="mb-2 flex cursor-pointer justify-center"
        pos="relative"
        onClick={handleViewWorkoutDetail}
      >
        <Group
          className="-left-2 top-2 flex-col items-start"
          pos="absolute"
          gap={2}
        >
          <Badge
            className={cn(
              "pointer-events-none capitalize",
              generateColorDifficultyLevel(workout.level, true),
            )}
            radius="md"
          >
            {generateLevelText(workout.level)}
          </Badge>
          <Badge
            className={cn(
              "pointer-events-none capitalize",
              generateColorDifficultyLevel(workout.level, true),
            )}
          >
            {workout.target}
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
        <Text size="sm" c="dimmed" className="capitalize">
          {workout.target}
        </Text>
        <Text size="sm" c="dimmed" className="mb-2 line-clamp-4 w-full">
          {workout.description || "No description"}
        </Text>
      </Group>
    </Card>
  );
};
