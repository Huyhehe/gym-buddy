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
  Modal,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { MediaDropZone } from "../../MediaDropZone";
import { api } from "@/trpc/react";
import { ExerciseSelectBoard } from "../exercises/ExerciseSelectBoard";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import type { AdminSingleWorkoutReturnType } from "@/types";
import { WorkoutFormProvider, useWorkoutForm } from "@/app/admin/_context";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";

const initialValues: TWorkoutFormValues = {
  title: "",
  description: "",
  level: levelOptions[0]?.value ?? "",
  target: targetOptions[0]?.value ?? "",
  thumbnail: "",
  exercises: [],
};

type Props = {
  workoutFromData?: AdminSingleWorkoutReturnType;
};

export const WorkoutCreateForm = ({ workoutFromData }: Props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { replace } = useRouter();

  const [deleteConfirmOpened, { close, open }] = useDisclosure();

  const { data: exercises } = api.exercise.getExercises.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { mutate: createWorkout, isPending: createPending } =
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

  const { mutate: updateWorkout, isPending: updateLoading } =
    api.admin.updateWorkout.useMutation({
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
              Workout updated
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

  const { mutate: deleteWorkoutMutation, isPending: deleteLoading } =
    api.admin.deleteWorkout.useMutation({
      onSuccess: () => {
        replace("/admin/workouts");
      },
    });

  const form = useWorkoutForm({
    mode: "controlled",
    initialValues: workoutFromData ?? initialValues,
    validate: zodResolver(workoutCreateFormSchema),
  });

  const handleSubmit = (values: TWorkoutFormValues) => {
    !!workoutFromData ? updateWorkout(values) : createWorkout(values);
  };

  return (
    <Box pos="relative" className="mt-4">
      <LoadingOverlay
        visible={createPending || updateLoading || deleteLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "blue", type: "bars" }}
      />
      <WorkoutFormProvider form={form}>
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
            initialFiles={
              !!form.values.thumbnail ? [form.values.thumbnail] : []
            }
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
            {!!workoutFromData && (
              <Button className="bg-red-700" onClick={open}>
                Delete
              </Button>
            )}
            <Button type="submit">{!!false ? "Save" : "Submit"}</Button>
          </Group>
        </form>
      </WorkoutFormProvider>

      <Modal opened={deleteConfirmOpened} onClose={close}>
        <Text>Are you sure you want to delete this exercise?</Text>
        <Group justify="flex-end" mt="md">
          <Button onClick={close}>Cancel</Button>
          <Button
            className="bg-red-700"
            onClick={() => {
              if (!workoutFromData?.id) {
                return;
              }

              deleteWorkoutMutation(workoutFromData?.id);
              close();
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </Box>
  );
};