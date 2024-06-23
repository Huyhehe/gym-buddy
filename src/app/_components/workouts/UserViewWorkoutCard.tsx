"use client";

import { api } from "@/trpc/react";
import type { WorkoutReturnType } from "@/types";
import {
  cn,
  generateColorDifficultyLevel,
  generateLevelText,
  getGoalLabel,
  showNoti,
} from "@/utils";
import {
  Badge,
  Card,
  Group,
  Image,
  Text,
  Tooltip,
  type CardProps,
} from "@mantine/core";

import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = CardProps & {
  workout: WorkoutReturnType;
  refetchWorkout: () => void;
};
export const UserViewWorkoutCard = ({
  workout,
  className = "h-full",
  refetchWorkout,
  ...props
}: Props) => {
  const [isBookmarked, setIsBookmarked] = useState(
    workout.isBookmarked ?? false,
  );
  const { mutate: bookMarkWorkout } = api.workout.bookMarkWorkout.useMutation({
    onSuccess: () => {
      showNoti({ message: "Lưu chương trình tập thành công" });
      refetchWorkout();
    },
    onError: () => {
      showNoti({
        status: "error",
        message: "Lưu chương trình tập không thành công",
      });
      setIsBookmarked(false);
    },
  });

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { push } = useRouter();

  const handleViewWorkoutDetail = () => {
    push(`/workouts/${workout.id}`);
  };

  const handleBookmarkClick = (isBookmarked: boolean) => {
    bookMarkWorkout({
      workoutId: workout.id,
      isBookmarked,
    });
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={className}
      {...props}
    >
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
          <Tooltip
            label={`Để hủy lưu, vui lòng xóa chương trình trong "Chương trình tập của tôi"`}
          >
            <IconBookmarkFilled className="text-white" />
          </Tooltip>
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
            {getGoalLabel(workout.target)}
          </Badge>
        </Group>
        <Image
          src={workout.thumbnail}
          alt={workout.title}
          fit="cover"
          className="aspect-video max-w-full"
        />
      </Card.Section>

      <Group gap={16}>
        <Text size="sm" c="dimmed" className="mb-2 line-clamp-4 w-full">
          {workout.description || "No description"}
        </Text>
      </Group>
    </Card>
  );
};
