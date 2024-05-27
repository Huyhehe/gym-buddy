import { ToggleBackMale } from "@/app/_components/MuscleSkeleton/ToggleBackMale";
import { ToggleFrontMale } from "@/app/_components/MuscleSkeleton/ToggleFrontMale";
import { Icon } from "@/assets/icons/Icon";
import type { GeneratedWorkoutReturnType } from "@/types";
import { cn, generateLevelText, generateMuscleState } from "@/utils";
import { Center, Group, Stack, type GroupProps } from "@mantine/core";
import { IconArrowsSort } from "@tabler/icons-react";

type Props = GroupProps & {
  exercise: GeneratedWorkoutReturnType[number];
};

export const GeneratedExerciseCard = ({ exercise, ...props }: Props) => {
  return (
    <Group
      className="w-full items-stretch rounded-lg bg-gray-50 p-2 shadow-md"
      wrap="nowrap"
      {...props}
    >
      <Center>
        <IconArrowsSort className="text-gray-300" />
      </Center>
      <video
        src={exercise.ExerciseExample[0]?.mediaURL}
        width={300}
        className="rounded-lg"
        autoPlay
        loop
        muted
      />
      <Stack gap={8} align="start" justify="start">
        <h1 className="text-2xl font-bold text-primary">{exercise.name}</h1>
        <h2 className="text-xl font-semibold text-gray-600">
          {generateLevelText(exercise.difficulty)}
        </h2>
        <h2 className="text-xl font-semibold capitalize">
          {exercise.sets} x {exercise.reps}{" "}
          {`${exercise.repsUnit}${exercise.reps > 1 ? "s" : ""}`}
        </h2>
        <Group align="center" className="text-lg font-semibold text-gray-400">
          <Icon
            html={exercise.Equipment?.icon}
            className={cn("flex items-center", {
              "mx-2 h-4 w-4": exercise.Equipment?.name === "Bodyweight",
              "mx-1 h-6 w-6": ["Kettlebells", "Plate", "Vitruvian"].includes(
                exercise.Equipment?.name,
              ),
              "[&_svg]:h-8 [&_svg]:w-8": exercise.Equipment?.name === "Cardio",
            })}
          />
          {exercise.Equipment?.name}
        </Group>
      </Stack>
      <Group wrap="nowrap" className="ml-auto h-fit w-1/4">
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
      </Group>
    </Group>
  );
};
