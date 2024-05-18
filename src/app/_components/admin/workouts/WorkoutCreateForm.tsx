"use client";

import {
  type TWorkoutFormValues,
  workoutCreateFormSchema,
} from "@/app/admin/_schemas";
import { levelOptions, targetOptions } from "@/utils";
import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { MediaDropZone } from "../../MediaDropZone";
import { api } from "@/trpc/react";
import { ExerciseSelectBoard } from "../exercises/ExerciseSelectBoard";
import { notifications } from "@mantine/notifications";
import Link from "next/link";

const initialValues: TWorkoutFormValues = {
  title: "",
  description: "",
  level: levelOptions[0]?.value ?? "",
  target: targetOptions[0]?.value ?? "",
  thumbnail: "",
  exercises: [],
};

export const WorkoutCreateForm = () => {
  const { data: exercises } = api.exercise.getExercises.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { mutate: createWorkout, isPending } =
    api.admin.createWorkout.useMutation({
      onError: (error) => {
        notifications.show({
          title: "Error",
          message: error.message,
          color: "red",
        });
      },
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: (
            <>
              Workout created
              <Link
                href="/admin/workouts"
                className="ml-1 text-sky-500 underline"
              >
                Check it here!
              </Link>
            </>
          ),
          color: "green",
        });
      },
    });

  const form = useForm<TWorkoutFormValues>({
    mode: "uncontrolled",
    initialValues,
    validate: zodResolver(workoutCreateFormSchema),
  });

  const handleSubmit = (values: TWorkoutFormValues) => {
    createWorkout(values);
  };

  return (
    <Box pos="relative" className="mt-4">
      <LoadingOverlay
        visible={isPending}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "blue", type: "bars" }}
      />
      <form className="space-y-2" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          label="Workout name"
          placeholder="The 1st Dumbbell Workout"
          key={form.key("title")}
          {...form.getInputProps("title")}
        />

        <Select
          withAsterisk
          label="Level"
          data={levelOptions}
          key={form.key("level")}
          {...form.getInputProps("level")}
        />

        <Select
          withAsterisk
          label="Target"
          data={targetOptions}
          key={form.key("target")}
          {...form.getInputProps("target")}
        />

        <Textarea
          className="grow"
          label="Description"
          placeholder="This workout is designed to..."
          key={form.key("description")}
          {...form.getInputProps("description")}
        />

        <MediaDropZone
          maxFiles={1}
          onReturnValue={(thumbnail) => {
            if (!thumbnail?.length) {
              return;
            }
            form.setFieldValue("thumbnail", thumbnail[0] ?? "");
          }}
          title="Drop thumbnail media here"
        />

        {!!exercises && (
          <ExerciseSelectBoard
            exercises={exercises}
            key={form.key("exercises")}
            {...form.getInputProps("exercises")}
          />
        )}

        <Group justify="flex-end" mt="md">
          <Button type="submit">{!!false ? "Save" : "Submit"}</Button>
        </Group>
      </form>
    </Box>
  );
};
