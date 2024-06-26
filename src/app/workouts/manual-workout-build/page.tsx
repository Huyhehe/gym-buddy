"use client";

import { ExerciseSelectBoard } from "@/app/_components/admin/exercises/ExerciseSelectBoard";
import { api } from "@/trpc/react";
import { ExerciseReturnType } from "@/types";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Button, Group, ScrollArea, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { debounce } from "lodash";
import { zodResolver } from "mantine-form-zod-resolver";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GeneratedExerciseCard } from "../workout-builder/_components/GeneratedExerciseCard";
import { useGlobalContext } from "../workout-builder/_context/global-context";
import {
  ManualWorkoutBuildFormProvider,
  useManualWorkoutBuildForm,
} from "./_context/form-context";
import {
  type TManualWorkoutBuildFormValues,
  manualWorkoutBuildFormSchema,
} from "./_schema";
import { stringDeepIncludesCheck } from "@/utils";

const ManualWorkoutBuildPage = () => {
  const { loginModalOpen, setIsBackdropOpen } = useGlobalContext();
  const router = useRouter();

  const [filteredExercises, setFilteredExercises] =
    useState<ExerciseReturnType[]>();
  const { data: exercises, isLoading } = api.exercise.getExercises.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  const { mutate: saveGeneratedWorkout } =
    api.workout.saveGeneratedWorkout.useMutation({
      onError: (error) => {
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
        setIsBackdropOpen(false);
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

  useEffect(() => {
    setFilteredExercises(exercises);
  }, [exercises]);

  const form = useManualWorkoutBuildForm({
    initialValues: {
      title: "Chương trình tập của tôi",
      exercises: [],
    },
    validate: zodResolver(manualWorkoutBuildFormSchema),
  });

  const reArrangedExercises = useMemo(
    () =>
      form.values.exercises.map((id) =>
        exercises?.find((exercise) => exercise.id === id),
      ),
    [form.values.exercises, exercises],
  );

  const handleSetSearch = useCallback(
    debounce(
      (searchStr: string | undefined, exercises: ExerciseReturnType[]) => {
        setFilteredExercises(
          exercises?.filter((ex) =>
            stringDeepIncludesCheck(ex.name, searchStr ?? ""),
          ),
        );
      },
      500,
    ),
    [],
  );

  const handleSubmit = (values: TManualWorkoutBuildFormValues) => {
    setIsBackdropOpen(true);
    saveGeneratedWorkout({
      ...values,
      description: "",
      thumbnail: "",
      level: "0",
      target: "my-goal",
    });
  };
  return (
    <div className="p-6">
      <ManualWorkoutBuildFormProvider form={form}>
        <form className="space-y-4" onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            classNames={{
              input:
                "text-5xl h-auto font-bold text-center py-2 border-[3px] border-black",
            }}
            key={form.key("title")}
            {...form.getInputProps("title")}
            radius="md"
          />
          <ScrollArea h={600} className="rounded-lg shadow-md">
            {form.values.exercises.length === 0 && (
              <p className="p-4 text-center text-3xl font-semibold text-gray-400">
                Hãy chọn ít nhất một bài tập bên dưới
              </p>
            )}
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
          </ScrollArea>
          <Button
            disabled={Object.keys(form.errors).length > 0}
            type="submit"
            className="h-fit w-full self-center bg-primary p-4 text-2xl"
          >
            Lưu chương trình này!
          </Button>
          <TextInput
            placeholder="Tìm kiếm bài tập"
            onChange={(e) => {
              handleSetSearch(e.target.value, exercises ?? []);
            }}
            className="w-fit"
            classNames={{
              input: "text-lg",
            }}
            radius="md"
          />
          {isLoading && <span>Đang tải dữ liệu...</span>}
          {!isLoading && !filteredExercises?.length && (
            <span>Không có dữ liệu trùng khớp</span>
          )}
          {!!filteredExercises && (
            <ExerciseSelectBoard
              exercises={filteredExercises}
              selectedExercises={form.values.exercises}
              key={form.key("exercises")}
              {...form.getInputProps("exercises")}
            />
          )}
        </form>
      </ManualWorkoutBuildFormProvider>
    </div>
  );
};

export default ManualWorkoutBuildPage;
