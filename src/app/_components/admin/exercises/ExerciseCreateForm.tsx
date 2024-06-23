"use client";
import {
  cn,
  targetOptions as goalOptions,
  levelOptions,
  mechanicOptions,
  repsUnitOptions,
} from "@/utils";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  Text,
  TextInput,
  Textarea,
  type SelectProps,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  IconAsterisk,
  IconCheck,
  IconGripVertical,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import { randomId, useDisclosure } from "@mantine/hooks";
import { zodResolver } from "mantine-form-zod-resolver";
import { useEffect, useState, type ReactNode } from "react";

import { generateInitialExerciseFormValues } from "@/app/admin/_helpers";
import { useGlobalContext } from "@/app/workouts/workout-builder/_context/global-context";
import { Icon } from "@/assets/icons/Icon";
import { api } from "@/trpc/react";
import type { SingleExerciseReturnType } from "@/types";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import {
  exerciseCreateFormSchema,
  type TExerciseFormValues,
} from "../../../admin/_schemas";
import { MediaDropZone } from "../../MediaDropZone";
import { ToggleSkeleton } from "../../MuscleSkeleton/ToggleSkeleton";

const initialValues: TExerciseFormValues = {
  name: "",
  sets: 1,
  reps: 6,
  repsUnit: "rep",
  difficulty: "1",
  mechanic: "compound",
  goal: "lose-weight",
  force: "",
  equipmentId: "0",
  caloriesBurned: 100,
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
  muscleTargets: [],
};

type MediaExample = {
  male: string[];
  female: string[];
};

type Props = {
  exerciseFromData?: SingleExerciseReturnType;
};

const handleNotification = (isSuccess = false, message: ReactNode) => {
  notifications.show({
    title: isSuccess ? "Success" : "Error",
    message,
    color: isSuccess ? "green" : "red",
  });
};

export const ExerciseCreateForm = ({ exerciseFromData }: Props) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { replace } = useRouter();
  const { setIsBackdropOpen } = useGlobalContext();

  const [equipments] = api.client.getEquipments.useSuspenseQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const [deleteConfirmOpened, { close, open }] = useDisclosure();
  const [mediaURLs, setMediaURLs] = useState<MediaExample>(
    !!exerciseFromData
      ? generateInitialExerciseFormValues(exerciseFromData).mediaURLs
      : initialValues.mediaURLs,
  );

  const form = useForm<TExerciseFormValues>({
    mode: "uncontrolled",
    initialValues: exerciseFromData
      ? generateInitialExerciseFormValues(exerciseFromData)
      : initialValues,
    validate: zodResolver(exerciseCreateFormSchema),
  });

  const { mutate: createExerciseMutation, isPending: createLoading } =
    api.admin.createExercise.useMutation({
      onSuccess: () => {
        handleNotification(true, "Exercise created successfully");
        replace("/admin/exercises");
      },
      onError: (error) => {
        handleNotification(false, error.message);
      },
    });

  const { mutate: updateExerciseMutation, isPending: updateLoading } =
    api.admin.updateExercise.useMutation({
      onSuccess: () => {
        handleNotification(true, "Exercise updated successfully");
        replace("/admin/exercises");
      },
      onError: (error) => {
        handleNotification(false, error.message);
      },
    });

  const { mutate: deleteExerciseMutation, isPending: deleteLoading } =
    api.admin.deleteExercise.useMutation({
      onSuccess: () => {
        handleNotification(true, "Exercise deleted successfully");
        replace("/admin/exercises");
      },
      onError: (error) => {
        handleNotification(false, error.message);
      },
    });

  const handleSubmit = (values: TExerciseFormValues) => {
    const inputValues: TExerciseFormValues = {
      ...values,
      name: values.name.trim(),
      mediaURLs,
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

  const equipmentOptions: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const equipment = equipments?.find((e) => e.id === option.value);
    return (
      <Group flex="1" gap="xs">
        <Icon
          html={equipment?.icon ?? ""}
          className={cn("flex items-center text-primary", {
            "mx-2.5 h-3 w-3": equipment?.name === "Bodyweight",
            "mx-1 h-6 w-6": ["Kettlebells", "Plate", "Vitruvian"].includes(
              equipment?.name ?? "",
            ),
            "[&_svg]:h-8 [&_svg]:w-8": equipment?.name === "Cardio",
          })}
        />
        {option.label}
        {checked && <IconCheck style={{ marginInlineStart: "auto" }} />}
      </Group>
    );
  };

  useEffect(() => {
    setIsBackdropOpen(createLoading || updateLoading || deleteLoading);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createLoading, updateLoading, deleteLoading]);

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col>
            <TextInput
              radius="md"
              withAsterisk
              label="Tên bài tập"
              placeholder="Đẩy ngực với tạ đòn"
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              radius="md"
              withAsterisk
              label="Số hiệp tập"
              key={form.key("sets")}
              {...form.getInputProps("sets")}
              min={1}
              max={7}
              decimalScale={0}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              radius="md"
              withAsterisk
              label="Số lần tập"
              key={form.key("reps")}
              {...form.getInputProps("reps")}
              min={3}
              max={100}
              decimalScale={0}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <Select
              allowDeselect={false}
              radius="md"
              withAsterisk
              label="Đơn vị"
              data={repsUnitOptions}
              key={form.key("repsUnit")}
              {...form.getInputProps("repsUnit")}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              radius="md"
              withAsterisk
              label="Số calo đốt cháy"
              key={form.key("caloriesBurned")}
              {...form.getInputProps("caloriesBurned")}
              min={20}
              max={1000}
              decimalScale={0}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <Select
              allowDeselect={false}
              radius="md"
              withAsterisk
              label="Độ khó"
              data={levelOptions}
              key={form.key("difficulty")}
              {...form.getInputProps("difficulty")}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <Select
              allowDeselect={false}
              radius="md"
              withAsterisk
              label="Mục tiêu"
              data={goalOptions}
              key={form.key("goal")}
              {...form.getInputProps("goal")}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <Select
              allowDeselect={false}
              radius="md"
              withAsterisk
              label="Dạng bài tập"
              data={mechanicOptions}
              key={form.key("mechanic")}
              {...form.getInputProps("mechanic")}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            {!!equipments && (
              <Select
                allowDeselect={false}
                radius="md"
                label="Dụng cụ"
                withAsterisk
                data={equipments?.map((equipment) => ({
                  label: equipment.name,
                  value: equipment.id,
                }))}
                renderOption={equipmentOptions}
                key={form.key("equipmentId")}
                {...form.getInputProps("equipmentId")}
              />
            )}
          </Grid.Col>

          <Grid.Col>
            <TextInput
              radius="md"
              label="Loại lực"
              placeholder="Đẩy, Kéo, Giữ, vv."
              key={form.key("force")}
              {...form.getInputProps("force")}
            />
          </Grid.Col>
        </Grid>

        <div>
          <Text
            display="flex"
            size="sm"
            className="gap-1 font-medium"
            mt="xs"
            mb={4}
          >
            Các bước tập luyện <IconAsterisk size={8} color="red" />
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
                  {form.getValues().steps?.map((item, index) => (
                    <Draggable
                      key={item.key}
                      index={index}
                      draggableId={item.key}
                    >
                      {(draggableProvided) => (
                        <Group
                          ref={draggableProvided.innerRef}
                          mb="xs"
                          {...draggableProvided.draggableProps}
                        >
                          <Center {...draggableProvided.dragHandleProps}>
                            <IconGripVertical size="1.2rem" />
                          </Center>
                          <Textarea
                            radius="md"
                            className="grow"
                            placeholder="Đẩy thanh đòn lên..."
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
          <Text
            display="flex"
            size="sm"
            className="gap-1 font-medium"
            mt="xs"
            mb={4}
          >
            Video ví dụ <IconAsterisk size={8} color="red" />
          </Text>
          <div className="grid grid-cols-2 gap-10">
            <MediaDropZone
              key={"male"}
              initialFiles={form.values.mediaURLs.male}
              multiple
              maxFiles={2}
              onReturnValue={onReturnMaleMediaURL}
              title="Kéo thả tệp phương tiện dành cho nam tại đây"
            />
            <MediaDropZone
              key={"female"}
              initialFiles={form.values.mediaURLs.female}
              multiple
              maxFiles={2}
              onReturnValue={onReturnFemaleMediaURL}
              title="Kéo thả tệp phương tiện dành cho nữ tại đây"
            />
          </div>
        </div>

        <Group justify="flex-end" mt="md">
          {/* <Button
            radius="md"
            className="bg-slate-500"
            onClick={() => {
              form.reset();
              setMuscleTarget(initialMuscleTarget);
              setMediaURLs(initialValues.mediaURLs);
            }}
          >
            Reset
          </Button> */}
          {!!exerciseFromData && (
            <Button radius="md" className="bg-red-700" onClick={open}>
              Xóa
            </Button>
          )}
          <Button radius="md" type="submit">
            {!!exerciseFromData ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Group>
      </form>

      <Group className="flex justify-center">
        <ToggleSkeleton
          className="w-1/2"
          initialDataForViewMode={(
            form.values?.muscleTargets?.map((muscle) => ({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              [muscle.name]: muscle.level,
            })) ?? []
          ).reduce((acc, obj) => {
            return { ...acc, ...obj };
          }, {})}
          onReturnValue={(value) => {
            const muscleTargets = [];
            for (const [key, val] of Object.entries(value)) {
              if (!!val) {
                muscleTargets.push({
                  name: key,
                  level: val,
                });
              }
            }
            form.setFieldValue("muscleTargets", muscleTargets);
          }}
        />
      </Group>

      <Modal opened={deleteConfirmOpened} onClose={close}>
        <Text>Bạn có chắc muốn xóa bài tập này không?</Text>
        <Group justify="flex-end" mt="md">
          <Button radius="md" onClick={close}>
            Hủy
          </Button>
          <Button
            radius="md"
            className="bg-red-700"
            onClick={() => {
              if (!exerciseFromData?.id) {
                return;
              }

              deleteExerciseMutation(exerciseFromData?.id);
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
