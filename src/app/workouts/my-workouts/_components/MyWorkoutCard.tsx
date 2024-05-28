"use client";

import { ToggleBackMale } from "@/app/_components/MuscleSkeleton/ToggleBackMale";
import { ToggleFrontMale } from "@/app/_components/MuscleSkeleton/ToggleFrontMale";
import { Icon } from "@/assets/icons/Icon";
import type { UserWorkoutReturnType } from "@/types";
import { cn, combineMuscleAffection, generateMuscleState } from "@/utils";
import { Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconTrash } from "@tabler/icons-react";
import { uniqBy } from "lodash";
import { useMemo } from "react";

type Props = {
  userWorkout: UserWorkoutReturnType;
};

export const MyWorkoutCard = ({ userWorkout }: Props) => {
  const [equipmentsExpanded, { open: equipmentOpen, close: equipmentClose }] =
    useDisclosure(false);

  const exercises = useMemo(() => {
    return userWorkout.workout.WorkoutExerciseStep.map(
      (exercise) => exercise.exercise,
    );
  }, [userWorkout.workout.WorkoutExerciseStep]);

  const equipments = useMemo(() => {
    return uniqBy(
      exercises.map((exercise) => exercise.Equipment),
      "id",
    );
  }, [exercises]);

  console.log({ equipments });

  return (
    <Stack gap={0} className="overflow-hidden rounded-lg bg-white shadow-sm">
      <Group className="my-workout-card-header p-2" justify="space-between">
        <h3 className="ml-12 self-start font-bold text-white">
          {userWorkout.workout.title}
        </h3>
        <IconTrash size={32} color="white" className="box-content py-4" />
      </Group>
      <Group className="bg-gray-200" justify="center">
        <Group wrap="nowrap" className="w-2/3 self-center p-2">
          <ToggleFrontMale
            viewMode
            initialDataForViewMode={
              generateMuscleState(
                combineMuscleAffection(
                  exercises
                    .map((exercises) => exercises.ExerciseMuscleTarget)
                    .flat(),
                ),
              ).front
            }
          />
          <ToggleBackMale
            viewMode
            initialDataForViewMode={
              generateMuscleState(
                combineMuscleAffection(
                  exercises
                    .map((exercises) => exercises.ExerciseMuscleTarget)
                    .flat(),
                ),
              ).back
            }
          />
        </Group>
      </Group>
      <Group justify="space-between" className="p-2">
        <p>Equipment</p>
        <Group className="">
          {equipments.map((equipment) => {
            return (
              <Icon
                key={equipment.id}
                html={equipment?.icon ?? ""}
                className={cn("flex items-center", {
                  "mx-2.5 h-3 w-3": equipment?.name === "Bodyweight",
                  "mx-1 h-6 w-6": [
                    "Kettlebells",
                    "Plate",
                    "Vitruvian",
                  ].includes(equipment?.name ?? ""),
                  "[&_svg]:h-8 [&_svg]:w-8": equipment?.name === "Cardio",
                })}
              />
            );
          })}
          <IconChevronDown
            className={cn("transition-all duration-300", {
              "rotate-180": equipmentsExpanded,
            })}
            onClick={() => {
              if (equipmentsExpanded) return equipmentClose();
              equipmentOpen();
            }}
          />
        </Group>
      </Group>
    </Stack>
  );
};
