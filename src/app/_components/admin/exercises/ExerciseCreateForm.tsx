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

  const { data: equipments, isLoading: equipmentsCallLoading } =
    api.client.getEquipments.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const [deleteConfirmOpened, { close, open }] = useDisclosure();
  const [mediaURLs, setMediaURLs] = useState<MediaExample>(
    !!exerciseFromData
      ? generateInitialExerciseFormValues(exerciseFromData).mediaURLs
      : initialValues.mediaURLs,
  );
  const [muscleTarget, setMuscleTarget] =
    useState<MuscleTarget>(initialMuscleTarget);

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
        form.reset();
        setMuscleTarget(initialMuscleTarget);
        setMediaURLs(initialValues.mediaURLs);
      },
      onError: (error) => {
        handleNotification(false, error.message);
      },
    });

  const { mutate: updateExerciseMutation, isPending: updateLoading } =
    api.admin.updateExercise.useMutation({
      onSuccess: () => {
        replace("/admin/exercises");
        handleNotification(true, "Exercise updated successfully");
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
    const frontMuscleTargets: TExerciseFormValues["muscleTargets"]["front"] =
      [];
    for (const [key, value] of Object.entries(muscleTarget.front)) {
      if (!!value) {
        frontMuscleTargets.push({
          name: key,
          level: value,
        });
      }
    }
    const backMuscleTargets: TExerciseFormValues["muscleTargets"]["back"] = [];
    for (const [key, value] of Object.entries(muscleTarget.back)) {
      if (!!value) {
        backMuscleTargets.push({
          name: key,
          level: value,
        });
      }
    }

    const inputValues: TExerciseFormValues = {
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
    setIsBackdropOpen(
      createLoading || updateLoading || deleteLoading || equipmentsCallLoading,
    );
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createLoading, updateLoading, deleteLoading, equipmentsCallLoading]);

  return (
    <Box>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col>
            <TextInput
              withAsterisk
              label="Exercise name"
              placeholder="Incline Dumbbell Bench Press"
              key={form.key("name")}
              {...form.getInputProps("name")}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              withAsterisk
              label="Sets"
              key={form.key("sets")}
              {...form.getInputProps("sets")}
              min={1}
              max={7}
              decimalScale={0}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              withAsterisk
              label="Reps"
              key={form.key("reps")}
              {...form.getInputProps("reps")}
              min={3}
              max={100}
              decimalScale={0}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <Select
              withAsterisk
              label="Unit"
              data={repsUnitOptions}
              key={form.key("repsUnit")}
              {...form.getInputProps("repsUnit")}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <NumberInput
              withAsterisk
              label="Calories Burned"
              key={form.key("caloriesBurned")}
              {...form.getInputProps("caloriesBurned")}
              min={100}
              max={1000}
              decimalScale={0}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <Select
              withAsterisk
              label="Difficulty"
              data={levelOptions}
              key={form.key("difficulty")}
              {...form.getInputProps("difficulty")}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <Select
              withAsterisk
              label="Goal"
              data={goalOptions}
              key={form.key("goal")}
              {...form.getInputProps("goal")}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            <Select
              withAsterisk
              label="Mechanic"
              data={mechanicOptions}
              key={form.key("mechanic")}
              {...form.getInputProps("mechanic")}
            />
          </Grid.Col>

          <Grid.Col span={3}>
            {!!equipments && (
              <Select
                label="Equipment"
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
              label="Force"
              placeholder="Push, Pull, Hold, etc."
              key={form.key("force")}
              {...form.getInputProps("force")}
            />
          </Grid.Col>
        </Grid>

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
                  {form.getValues().steps?.map((item, index) => (
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
                          <Center {...draggableProvided.dragHandleProps}>
                            <IconGripVertical size="1.2rem" />
                          </Center>
                          <Textarea
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
          {/* <Button
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
            <Button className="bg-red-700" onClick={open}>
              Delete
            </Button>
          )}
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

      <Modal opened={deleteConfirmOpened} onClose={close}>
        <Text>Are you sure you want to delete this exercise?</Text>
        <Group justify="flex-end" mt="md">
          <Button onClick={close}>Cancel</Button>
          <Button
            className="bg-red-700"
            onClick={() => {
              if (!exerciseFromData?.id) {
                return;
              }

              deleteExerciseMutation(exerciseFromData?.id);
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
