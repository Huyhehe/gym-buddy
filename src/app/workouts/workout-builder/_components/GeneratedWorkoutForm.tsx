"use client";

import { ToggleSkeleton } from "@/app/_components/MuscleSkeleton/ToggleSkeleton";
import {
  workoutCreateFormSchema,
  type TWorkoutFormValues,
} from "@/app/admin/_schemas";
import { api } from "@/trpc/react";
import type { GeneratedWorkoutReturnType } from "@/types";
import {
  combineMuscleAffection,
  generateLevelText,
  generateMuscleState,
  getGoalLabel,
} from "@/utils";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAward,
  IconBolt,
  IconCheck,
  IconPencilMinus,
  IconStack,
  IconX,
} from "@tabler/icons-react";
import { zodResolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { useGlobalContext } from "../_context/global-context";
import type { TWorkoutBuilderFormValues } from "../_schemas";
import { GeneratedExerciseCard } from "./GeneratedExerciseCard";

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
  const { loginModalOpen, setIsBackdropOpen } = useGlobalContext();
  const [isEditingName, { open, close }] = useDisclosure();
  const router = useRouter();

  const { mutate: saveGeneratedWorkout } =
    api.workout.saveGeneratedWorkout.useMutation({
      onError: (error) => {
        setIsBackdropOpen(false);
        notifications.show({
          title: "Lỗi",
          message: (
            <div>
              <span>{error.message}</span>
              <div>
                <span
                  className="mr-1 cursor-pointer text-primary underline"
                  onClick={loginModalOpen}
                >
                  Đăng nhập
                </span>
                <span>để lưu chương trình tập này</span>
              </div>
            </div>
          ),
          color: "red",
        });
      },
      onSuccess: () => {
        notifications.show({
          title: "Thành công",
          message: "Đã lưu chương trình tập thành công!",
          color: "green",
        });
        setIsBackdropOpen(false);
        router.push("/workouts/my-workouts");
      },
    });

  const form = useForm<TWorkoutFormValues>({
    initialValues: {
      title: "Chương trình tập của tôi",
      exercises: exercises.map((exercise) => exercise.id),
      description:
        "Chương trình tập này được tạo tự động bởi hệ thống thông qua thông tin từ người dùng",
      thumbnail: "",
      level: workoutBuilderFormValues.currentLevel.toString(),
      target: workoutBuilderFormValues.goal,
    },
    validate: zodResolver(workoutCreateFormSchema),
  });
  const nameRef = useRef<string>(form.values.title);

  const reArrangedExercises = useMemo(
    () =>
      form.values.exercises.map((id) =>
        exercises.find((exercise) => exercise.id === id),
      ),
    [form.values.exercises, exercises],
  );

  const handleSubmit = (values: TWorkoutFormValues) => {
    setIsBackdropOpen(true);
    saveGeneratedWorkout(values);
  };

  return (
    <div className="@container/generated-form">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack
          align="center"
          className="mx-auto w-full items-stretch @4xl/generated-form:w-11/12 @5xl/generated-form:w-4/5"
        >
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
                  radius="md"
                  key={form.key("title")}
                  {...form.getInputProps("title")}
                />
                <IconCheck
                  size={40}
                  className="cursor-pointer rounded-full p-1 text-gray-500 hover:bg-green-500/20 hover:text-green-500"
                  onClick={() => {
                    nameRef.current = form.values.title;
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
                <span className="text-5xl font-bold">{form.values.title}</span>
                <IconPencilMinus
                  size={40}
                  className="cursor-pointer rounded-full p-1 text-gray-500 hover:bg-blue-700/20 hover:text-primary"
                  onClick={open}
                />
              </Group>
            )}
          </Group>
          <Stack align="center" gap={0}>
            <ToggleSkeleton
              viewMode
              className="w-[400px]"
              initialDataForViewMode={generateMuscleState(
                combineMuscleAffection(
                  exercises
                    .map((exercises) => exercises.ExerciseMuscleTarget)
                    .flat(),
                ),
              )}
              female={!workoutBuilderFormValues.gender}
            />

            <span className="text-gray-400">Độ mỏi của cơ</span>
            <div className="h-1 w-2/3 rounded-full bg-gradient-to-r from-white from-5% via-yellow-200 via-45% to-red-600" />
          </Stack>
          <Group className="justify-evenly rounded-lg bg-white p-4 shadow-md">
            <InfoCard
              title="Độ khó"
              subtitle={generateLevelText(
                workoutBuilderFormValues.currentLevel,
              )}
              icon={<IconBolt size={52} className="text-primary" />}
            />
            <InfoCard
              title="Số bài tập"
              subtitle={exercises.length.toString()}
              icon={<IconStack size={52} className="text-primary" />}
            />
            <InfoCard
              title="Mục tiêu"
              subtitle={getGoalLabel(workoutBuilderFormValues.goal)}
              icon={<IconAward size={52} className="text-primary" />}
            />
          </Group>
          <Stack className="rounded-lg bg-white p-4 shadow-md">
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
                            className="left-auto top-auto"
                          >
                            <GeneratedExerciseCard
                              exercise={item!}
                              {...draggableProvided.dragHandleProps}
                              female={!workoutBuilderFormValues.gender}
                            />
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
          <Button
            type="submit"
            className="box-content w-1/2 self-center bg-primary p-4 text-2xl"
          >
            Lưu chương trình này!
          </Button>
        </Stack>
      </form>
    </div>
  );
};
