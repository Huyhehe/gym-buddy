"use client";

import type { GeneratedWorkoutReturnType } from "@/types";
import type { TWorkoutBuilderFormValues } from "../_schemas";
import { Group, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconPencilMinus, IconX } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useRef } from "react";
import { combineMuscleAffection, generateMuscleState } from "@/utils";
import { ToggleFrontMale } from "@/app/_components/MuscleSkeleton/ToggleFrontMale";
import { ToggleBackMale } from "@/app/_components/MuscleSkeleton/ToggleBackMale";

type Props = {
  exercises: GeneratedWorkoutReturnType;
  workoutBuilderFormValues: TWorkoutBuilderFormValues;
};

export const GeneratedWorkoutForm = ({
  exercises,
  workoutBuilderFormValues,
}: Props) => {
  const [isEditingName, { open, close }] = useDisclosure();

  const form = useForm({
    initialValues: {
      name: "Chest workout",
    },
  });
  const nameRef = useRef<string>(form.values.name);

  console.log({
    values: form.values,
    // exercises,
    // workoutBuilderFormValues,
  });

  return (
    <div>
      <form>
        <Stack align="center" className="mx-auto w-2/3 items-stretch">
          <Group
            className="rounded-md border bg-white px-20 py-6 shadow-md"
            justify="center"
          >
            {isEditingName ? (
              <Group align="center">
                <TextInput
                  classNames={{
                    input:
                      "text-5xl h-auto font-bold text-gray-500 text-center",
                  }}
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                />
                <IconCheck
                  size={40}
                  className="cursor-pointer rounded-full p-1 text-gray-500 hover:bg-green-500/20 hover:text-green-500"
                  onClick={() => {
                    nameRef.current = form.values.name;
                    close();
                  }}
                />
                <IconX
                  size={40}
                  className="cursor-pointer rounded-full p-1 text-gray-500 hover:bg-red-700/20 hover:text-red-500"
                  onClick={() => {
                    form.setFieldValue("name", nameRef.current);
                    close();
                  }}
                />
              </Group>
            ) : (
              <Group>
                <span className="text-5xl font-bold">{form.values.name}</span>
                <IconPencilMinus
                  size={40}
                  className="cursor-pointer rounded-full p-1 text-gray-500 hover:bg-blue-700/20 hover:text-primary"
                  onClick={open}
                />
              </Group>
            )}
          </Group>
          <Stack align="center">
            <Group wrap="nowrap" w={400}>
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
          </Stack>
          <Stack className="bg-white p-4">
            {exercises.map((exercise) => (
              <Group key={exercise.id} align="center" justify="space-between">
                <span>{exercise.name}</span>
                <span>{exercise.difficulty}</span>
              </Group>
            ))}
          </Stack>
        </Stack>
      </form>
    </div>
  );
};
