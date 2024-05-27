"use client";

import type { GeneratedWorkoutReturnType } from "@/types";
import type { TWorkoutBuilderFormValues } from "../_schemas";
import { Center, Group, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAward,
  IconBolt,
  IconCheck,
  IconGripVertical,
  IconPencilMinus,
  IconStack,
  IconX,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useMemo, useRef } from "react";
import {
  combineMuscleAffection,
  generateLevelText,
  generateMuscleState,
  getGoalLabel,
} from "@/utils";
import { ToggleFrontMale } from "@/app/_components/MuscleSkeleton/ToggleFrontMale";
import { ToggleBackMale } from "@/app/_components/MuscleSkeleton/ToggleBackMale";
import { GeneratedExerciseCard } from "./GeneratedExerciseCard";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

type Props = {
  exercises: GeneratedWorkoutReturnType;
  workoutBuilderFormValues: TWorkoutBuilderFormValues;
};

type InfoCardProps = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};
const InfoCard = ({ title, subtitle, icon: Icon }: InfoCardProps) => {
  return (
    <Stack
      className="aspect-square w-36 rounded-lg bg-gray-50 p-4 shadow-md"
      align="center"
      justify="center"
      gap={2}
    >
      {Icon}
      <h4 className="font-semibold text-primary">{title}</h4>
      <span className="text-xs font-semibold">{subtitle}</span>
    </Stack>
  );
};

export const GeneratedWorkoutForm = ({
  exercises,
  workoutBuilderFormValues,
}: Props) => {
  const [isEditingName, { open, close }] = useDisclosure();

  const form = useForm({
    initialValues: {
      name: "Chest workout",
      exercises: exercises.map((exercise) => exercise.id),
    },
  });
  const nameRef = useRef<string>(form.values.name);

  const reArrangedExercises = useMemo(
    () =>
      form.values.exercises.map((id) =>
        exercises.find((exercise) => exercise.id === id),
      ),
    [form.values.exercises, exercises],
  );

  console.log({
    values: form.values,
    exercises,
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
          <Stack align="center" gap={0}>
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
            <span className="text-gray-400">Fatigue Gradient</span>
            <div className="h-1 w-2/3 rounded-full bg-gradient-to-r from-white from-5% via-yellow-200 via-45% to-red-600" />
          </Stack>
          <Group className="justify-evenly rounded-lg bg-white p-4 shadow-md">
            <InfoCard
              title="Level"
              subtitle={generateLevelText(
                workoutBuilderFormValues.currentLevel,
              )}
              icon={<IconBolt size={52} className="text-primary" />}
            />
            <InfoCard
              title="Exercises"
              subtitle={exercises.length.toString()}
              icon={<IconStack size={52} className="text-primary" />}
            />
            <InfoCard
              title="Goal"
              subtitle={getGoalLabel(workoutBuilderFormValues.goal)}
              icon={<IconAward size={52} className="text-primary" />}
            />
          </Group>
          <Stack className="rounded-lg bg-white p-4 shadow-md">
            {/* {exercises.map((exercise) => (
              <GeneratedExerciseCard key={exercise.id} exercise={exercise} />
            ))} */}
            <DragDropContext
              onDragEnd={({ destination, source }) =>
                destination?.index !== undefined &&
                form.reorderListItem("exercises", {
                  from: source.index,
                  to: destination.index,
                })
              }
            >
              <Droppable droppableId="dnd-list" direction="vertical">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {reArrangedExercises?.map((item, index) => (
                      <Draggable
                        key={item?.id}
                        index={index}
                        draggableId={item?.id ?? ""}
                      >
                        {(draggableProvided) => (
                          <Group
                            ref={draggableProvided.innerRef}
                            mt="xs"
                            {...draggableProvided.draggableProps}
                          >
                            <GeneratedExerciseCard
                              exercise={item!}
                              {...draggableProvided.dragHandleProps}
                            />
                            {/* <Textarea
                              className="grow"
                              placeholder="Push the bar up..."
                              key={form.key(`steps.${index}.value`)}
                              {...form.getInputProps(`steps.${index}.value`)}
                            />
                            <Center>
                              <IconTrash
                                className="cursor-pointer hover:text-red-500"
                                onClick={() => {
                                  form.removeListItem("steps", index);
                                }}
                              />
                            </Center> */}
                          </Group>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Stack>
        </Stack>
      </form>
    </div>
  );
};
