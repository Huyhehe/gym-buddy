"use client";

import { WorkoutFormProvider, useWorkoutForm } from "@/app/admin/_context";
import {
  workoutCreateFormSchema,
  type TWorkoutFormValues,
} from "@/app/admin/_schemas";
import { api } from "@/trpc/react";
import type { AdminSingleWorkoutReturnType } from "@/types";
import { levelOptions, targetOptions } from "@/utils";
import {
  Box,
  Button,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MediaDropZone } from "../../MediaDropZone";
import { ExerciseSelectBoard } from "../exercises/ExerciseSelectBoard";
import { useEffect } from "react";
import { useGlobalContext } from "@/app/workouts/workout-builder/_context/global-context";

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

  const { setIsBackdropOpen } = useGlobalContext();

  const [deleteConfirmOpened, { close, open }] = useDisclosure();

  const { data: exercises } = api.exercise.getExercises.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { mutate: createWorkout, isPending: createLoading } =
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

  useEffect(() => {
    setIsBackdropOpen(createLoading || updateLoading || deleteLoading);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createLoading, updateLoading, deleteLoading]);

  return (
    <Box pos="relative" className="mt-4">
      <WorkoutFormProvider form={form}>
        <form className="space-y-2" onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col>
              <TextInput
                withAsterisk
                label="Tên chương trình tập"
                placeholder="Bài tập số 1 dành cho người mới, vv."
                key={form.key("title")}
                {...form.getInputProps("title")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Select
                allowDeselect={false}
                withAsterisk
                label="Độ khó"
                data={levelOptions}
                key={form.key("level")}
                {...form.getInputProps("level")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Select
                allowDeselect={false}
                withAsterisk
                label="Mục tiêu"
                data={targetOptions}
                key={form.key("target")}
                {...form.getInputProps("target")}
              />
            </Grid.Col>
          </Grid>

          <Textarea
            className="grow"
            label="Mô tả"
            placeholder="Chương trình tập này tạo ra để..."
            key={form.key("description")}
            {...form.getInputProps("description")}
          />

          <MediaDropZone
            key="workoutthumbnail"
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
            title="Kéo thả ảnh bìa vào đây"
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
                Xóa
              </Button>
            )}
            <Button type="submit">{!!false ? "Cập nhật" : "Tạo mới"}</Button>
          </Group>
        </form>
      </WorkoutFormProvider>

      <Modal opened={deleteConfirmOpened} onClose={close}>
        <Text>Bạn có chắc muốn xóa bài tập này chứ?</Text>
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
            Xóa
          </Button>
        </Group>
      </Modal>
    </Box>
  );
};
