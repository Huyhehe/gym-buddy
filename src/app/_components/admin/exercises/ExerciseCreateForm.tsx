"use client";
import { difficultyOptions, mechanicOptions } from "@/utils";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { IconAsterisk, IconGripVertical, IconPlus } from "@tabler/icons-react";

import { randomId, useDisclosure } from "@mantine/hooks";
import { zodResolver } from "mantine-form-zod-resolver";
import { useState } from "react";

import { api } from "@/trpc/react";
import { MediaDropZone } from "../../MediaDropZone";
import {
  ToggleBackMale,
  initialState as initialBackMuscleTarget,
  type ToggleState as BackAffectLevel,
} from "../../MuscleSkeleton/ToggleBackMale";
import {
  ToggleFrontMale,
  initialState as initialFrontMuscleTarget,
  type ToggleState as FrontAffectLevel,
} from "../../MuscleSkeleton/ToggleFrontMale";
import { type TFormValues, exerciseCreateFormSchema } from "../schemas";
import type { ExerciseReturnType } from "@/types";
import { generateInitialExerciseFormValues } from "@/app/admin/_helpers";

const initialValues: TFormValues = {
  name: "",
  sets: 1,
  reps: 6,
  difficulty: "beginner",
  mechanic: "compound",
  force: "",
  steps: [
    {
      value: "Step 1",
      key: "0",
    },
  ],
  mediaURLs: {
    male: [],
    female: [],
  },
  muscleTargets: {
    front: [],
    back: [],
  },
};

type MediaExample = {
  male: string[];
  female: string[];
};

type MuscleTarget = {
  front: FrontAffectLevel;
  back: BackAffectLevel;
};
const initialMuscleTarget: MuscleTarget = {
  front: initialFrontMuscleTarget,
  back: initialBackMuscleTarget,
};

type Props = {
  exerciseFromData?: ExerciseReturnType;
};

export const ExerciseCreateForm = ({ exerciseFromData }: Props) => {
  const [formSubmitting, { open, close }] = useDisclosure(false);

  const [mediaURLs, setMediaURLs] = useState<MediaExample>(
    !!exerciseFromData
      ? generateInitialExerciseFormValues(exerciseFromData).mediaURLs
      : initialValues.mediaURLs,
  );
  const [muscleTarget, setMuscleTarget] =
    useState<MuscleTarget>(initialMuscleTarget);

  const form = useForm<TFormValues>({
    mode: "uncontrolled",
    initialValues: exerciseFromData
      ? generateInitialExerciseFormValues(exerciseFromData)
      : initialValues,
    validate: zodResolver(exerciseCreateFormSchema),
  });

  const { mutate: createExerciseMutation } =
    api.admin.createExercise.useMutation({
      onSuccess: () => {
        form.reset();
        setMuscleTarget(initialMuscleTarget);
        setMediaURLs(initialValues.mediaURLs);
        close();
      },
      onError: () => {
        close();
      },
    });

  const { mutate: updateExerciseMutation } =
    api.admin.updateExercise.useMutation({
      onSuccess: () => {
        close();
      },
      onError: () => {
        close();
      },
    });

  const handleSubmit = (values: TFormValues) => {
    open();
    const frontMuscleTargets: TFormValues["muscleTargets"]["front"] = [];
    for (const [key, value] of Object.entries(muscleTarget.front)) {
      if (!!value) {
        frontMuscleTargets.push({
          name: key,
          level: value,
        });
      }
    }
    const backMuscleTargets: TFormValues["muscleTargets"]["back"] = [];
    for (const [key, value] of Object.entries(muscleTarget.back)) {
      if (!!value) {
        backMuscleTargets.push({
          name: key,
          level: value,
        });
      }
    }

    const inputValues: TFormValues = {
      ...values,
      mediaURLs,
      muscleTargets: {
        front: frontMuscleTargets,
        back: backMuscleTargets,
      },
    };
    !!exerciseFromData
      ? updateExerciseMutation(inputValues)
      : createExerciseMutation(inputValues);
  };

  const onReturnMaleMediaURL = (url: string[]) => {
    setMediaURLs((current) => ({
      ...current,
      male: url,
    }));
  };

  const onReturnFemaleMediaURL = (url: string[]) => {
    setMediaURLs((current) => ({
      ...current,
      female: url,
    }));
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={formSubmitting}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "blue", type: "bars" }}
      />
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          label="Exercise name"
          placeholder="Incline Dumbbell Bench Press"
          key={form.key("name")}
          {...form.getInputProps("name")}
        />

        <NumberInput
          withAsterisk
          label="Sets"
          key={form.key("sets")}
          {...form.getInputProps("sets")}
          min={1}
          max={7}
          decimalScale={0}
        />

        <NumberInput
          withAsterisk
          label="Reps"
          key={form.key("reps")}
          {...form.getInputProps("reps")}
          min={3}
          max={100}
          decimalScale={0}
        />

        <Select
          withAsterisk
          label="Difficulty"
          data={difficultyOptions}
          key={form.key("difficulty")}
          {...form.getInputProps("difficulty")}
        />

        <Select
          withAsterisk
          label="Mechanic"
          data={mechanicOptions}
          key={form.key("mechanic")}
          {...form.getInputProps("mechanic")}
        />

        <TextInput
          label="Force"
          placeholder="Push, Pull, Hold, etc."
          key={form.key("force")}
          {...form.getInputProps("force")}
        />

        <div>
          <Text
            display="flex"
            size="sm"
            className="items-center gap-1 font-medium"
          >
            Steps <IconAsterisk size={8} color="red" />
          </Text>
          <DragDropContext
            onDragEnd={({ destination, source }) =>
              destination?.index !== undefined &&
              form.reorderListItem("steps", {
                from: source.index,
                to: destination.index,
              })
            }
          >
            <Droppable droppableId="dnd-list" direction="vertical">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {form.getValues().steps.map((item, index) => (
                    <Draggable
                      key={item.key}
                      index={index}
                      draggableId={item.key}
                    >
                      {(draggableProvided) => (
                        <Group
                          ref={draggableProvided.innerRef}
                          mt="xs"
                          {...draggableProvided.draggableProps}
                        >
                          <Textarea
                            className="grow"
                            placeholder="Push the bar up..."
                            key={form.key(`steps.${index}.value`)}
                            {...form.getInputProps(`steps.${index}.value`)}
                          />
                          <Center {...draggableProvided.dragHandleProps}>
                            <IconGripVertical size="1.2rem" />
                          </Center>
                        </Group>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Group className="flex w-full justify-end">
            <ActionIcon
              variant="filled"
              onClick={() =>
                form.insertListItem("steps", {
                  value: "",
                  key: randomId(),
                })
              }
            >
              <IconPlus />
            </ActionIcon>
          </Group>
        </div>

        <div>
          <h3 className="flex">
            Media examples <IconAsterisk size={8} color="red" />
          </h3>
          <div className="grid grid-cols-2 gap-10">
            <MediaDropZone
              initialFiles={form.values.mediaURLs.male}
              maxFiles={4}
              onReturnValue={onReturnMaleMediaURL}
              title="Drop male media here"
            />
            <MediaDropZone
              initialFiles={form.values.mediaURLs.female}
              maxFiles={4}
              onReturnValue={onReturnFemaleMediaURL}
              title="Drop female media here"
            />
          </div>
        </div>

        <Group justify="flex-end" mt="md">
          <Button type="submit">
            {!!exerciseFromData ? "Save" : "Submit"}
          </Button>
        </Group>
      </form>

      <div className="flex justify-center">
        <ToggleFrontMale
          initialDataForViewMode={(
            form.values?.muscleTargets.front?.map((muscle) => ({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              [muscle.name]: muscle.level,
            })) ?? []
          ).reduce((acc, obj) => {
            return { ...acc, ...obj };
          }, {})}
          onReturnValue={(muscleTarget) =>
            setMuscleTarget((prev) => ({
              ...prev,
              front: muscleTarget,
            }))
          }
        />
        <ToggleBackMale
          initialDataForViewMode={(
            form.values?.muscleTargets.back?.map((muscle) => ({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              [muscle.name]: muscle.level,
            })) ?? []
          ).reduce((acc, obj) => {
            return { ...acc, ...obj };
          }, {})}
          onReturnValue={(muscleTarget) =>
            setMuscleTarget((prev) => ({
              ...prev,
              back: muscleTarget,
            }))
          }
        />
      </div>
    </Box>
  );
};
