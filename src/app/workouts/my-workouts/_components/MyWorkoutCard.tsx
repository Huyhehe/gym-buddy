"use client";

import { Icon } from "@/assets/icons/Icon";
import type { UserWorkoutReturnType } from "@/types";
import { cn, combineMuscleAffection, generateMuscleState } from "@/utils";
import { Button, Collapse, Group, Loader, Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandArc,
  IconChevronDown,
  IconSettingsCog,
  IconTrash,
  IconXboxX,
} from "@tabler/icons-react";
import { uniqBy } from "lodash";
import { useMemo } from "react";

import { ToggleSkeleton } from "@/app/_components/MuscleSkeleton/ToggleSkeleton";
import NetBg from "@/assets/images/net-bg.jpg";
import { api } from "@/trpc/react";
import { notifications } from "@mantine/notifications";
import Link from "next/link";

type Props = {
  userWorkout: UserWorkoutReturnType;
  refetch: () => void;
};

export const MyWorkoutCard = ({ userWorkout, refetch }: Props) => {
  const [equipmentsExpanded, { open: equipmentOpen, close: equipmentClose }] =
    useDisclosure(false);
  const [
    deleteConfirmationOpened,
    { open: deleteConfirmOpen, close: deleteConfirmClose },
  ] = useDisclosure(false);

  const { mutate: removeMyWorkout, isPending } =
    api.workout.removeMyWorkout.useMutation({
      onSuccess: () => {
        refetch();
        notifications.show({
          title: "Workout removed",
          message: "Workout has been removed successfully",
          color: "green",
        });
        deleteConfirmClose();
      },
      onError: (error) => {
        notifications.show({
          title: "Can't remove workout",
          message: error.message,
          color: "red",
        });
      },
    });

  const exercises = useMemo(() => {
    return userWorkout.workout.WorkoutExerciseStep.map(
      (exercise) => exercise.exercise,
    );
  }, [userWorkout.workout.WorkoutExerciseStep]);

  const equipments = useMemo(() => {
    return uniqBy(
      exercises.map((exercise) => exercise.Equipment),
      "id",
    );
  }, [exercises]);

  return (
    <>
      <Stack
        gap={0}
        className="group relative col-span-12 overflow-hidden rounded-lg bg-white shadow-sm transition-all @4xl:col-span-6 @6xl:col-span-4"
      >
        <Group
          className="my-workout-card-header relative p-2"
          justify="space-between"
        >
          <h3 className="ml-16 self-start text-xl font-bold text-white">
            {userWorkout.workout.title}
          </h3>
          <IconTrash
            size={32}
            color="white"
            className="box-content cursor-pointer py-4 transition-all hover:z-10 hover:scale-110"
            onClick={deleteConfirmOpen}
          />
          <div className="absolute -left-20 flex h-[200px] w-24 -rotate-45 bg-white opacity-25 blur-md duration-0 ease-in hover:transition-all group-hover:left-[110%] group-hover:duration-200" />
        </Group>
        <Stack
          className="relative overflow-hidden bg-gray-50 p-2 transition-all duration-300 group-hover:bg-gray-200"
          align="center"
          gap={2}
        >
          <ToggleSkeleton
            viewMode
            className="z-10 w-2/3 self-center p-2"
            initialDataForViewMode={generateMuscleState(
              combineMuscleAffection(
                exercises
                  .map((exercises) => exercises.ExerciseMuscleTarget)
                  .flat(),
              ),
            )}
          />
          <Stack className="z-10 w-1/2" gap={0} align="center">
            <span className="text-gray-400">Độ mỏi của cơ</span>
            <div className="h-1 w-full rounded-full bg-gradient-to-r from-white from-5% via-yellow-200 via-45% to-red-600" />
          </Stack>
          <div
            style={{
              backgroundImage: `url(${NetBg.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              maskImage:
                "radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)",
            }}
            className="absolute left-0 top-0 z-0 h-full w-full opacity-30"
          />
          <div className="absolute -bottom-10 -end-28 flex h-[90px] w-60 rotate-[315deg] bg-white shadow-[rgba(0,0,0,0.5)_5px_0px_20px_-11px] duration-300 sm:-bottom-4"></div>
        </Stack>
        <Group justify="space-between" className="relative p-2">
          <div className="absolute top-0 w-full rotate-180 border-b-4 border-white shadow-md" />
          <p className="text-sm">Công cụ</p>
          <Group>
            {equipments.map((equipment) => {
              return (
                <Icon
                  key={equipment.id}
                  html={equipment?.icon ?? ""}
                  className={cn(
                    "flex items-center transition-all duration-300",
                    {
                      "mx-2.5 h-3 w-3": equipment?.name === "Bodyweight",
                      "mx-1 h-6 w-6": [
                        "Kettlebells",
                        "Plate",
                        "Vitruvian",
                      ].includes(equipment?.name ?? ""),
                      "[&_svg]:h-8 [&_svg]:w-8": equipment?.name === "Cardio",
                      "invisible scale-0 opacity-0": equipmentsExpanded,
                    },
                  )}
                />
              );
            })}
            <IconChevronDown
              className={cn("cursor-pointer transition-all duration-300", {
                "rotate-180": equipmentsExpanded,
              })}
              onClick={() => {
                if (equipmentsExpanded) return equipmentClose();
                equipmentOpen();
              }}
            />
          </Group>
        </Group>
        <Collapse in={equipmentsExpanded}>
          <Group>
            {equipments.map((equipment) => {
              return (
                <Group
                  key={equipment.id}
                  gap={8}
                  align="center"
                  className="p-4"
                >
                  <Icon
                    html={equipment?.icon}
                    className={cn("flex items-center", {
                      "mx-2.5 h-4 w-4": equipment?.name === "Bodyweight",
                      "mx-1 h-6 w-6": [
                        "Kettlebells",
                        "Plate",
                        "Vitruvian",
                      ].includes(equipment?.name),
                      "[&_svg]:h-8 [&_svg]:w-8": equipment?.name === "Cardio",
                    })}
                  />
                  <span className="text-sm">{equipment.name}</span>
                </Group>
              );
            })}
          </Group>
        </Collapse>
        <Link
          href={`/workouts/my-workouts/training/${userWorkout.id}`}
          className="p-2 font-bold text-primary underline"
        >{`Tập luyện!`}</Link>

        {/* Absolute items */}
        <div className="absolute -start-20 -top-4 z-[8] flex h-60 w-[110px] rotate-45 border-4 border-white bg-white  drop-shadow-lg duration-300" />
        {userWorkout.workout.isAdminCreated ? (
          <IconBrandArc
            stroke={2}
            size={32}
            className="absolute start-6 top-10 z-[9]"
          />
        ) : (
          <IconSettingsCog
            stroke={2}
            size={32}
            className="absolute start-6 top-10 z-[9]"
          />
        )}
      </Stack>

      <Modal
        opened={deleteConfirmationOpened}
        onClose={() => !isPending && deleteConfirmClose()}
        radius="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Modal.Header className="flex-col justify-center pt-0">
          <IconXboxX stroke={2} size={102} color="red" />
          <h2 className="text-2xl font-bold">Bạn chắc chưa?</h2>
        </Modal.Header>
        <Modal.Body className="text-center font-medium">
          <p>Bạn có thật sự muốn xóa chương trình tập này không?</p>
          <p>Những kết quả tập luyện liên quan có thể bị xóa đi</p>
          <p>Quá trình này không thể hoàn tác</p>
        </Modal.Body>

        <Group justify="center" mt="md">
          <Button onClick={deleteConfirmClose} disabled={isPending}>
            Hủy
          </Button>
          <Button
            className="bg-red-700"
            disabled={isPending}
            onClick={() => {
              if (!userWorkout?.id) {
                return;
              }

              removeMyWorkout(userWorkout?.id);
            }}
          >
            Xóa
            {!!isPending && <Loader color="white" size={14} className="ml-2" />}
          </Button>
        </Group>
      </Modal>
    </>
  );
};
