import { ToggleSkeleton } from "@/app/_components/MuscleSkeleton/ToggleSkeleton";
import NetBg from "@/assets/images/net-bg.jpg";
import { MuscleTarget, TGetUserWorkoutFromRecord } from "@/types";
import {
  cn,
  combineMuscleAffection,
  generateMuscleState,
  getMuscleName,
} from "@/utils";
import { Group, Modal, Stack, Text, Timeline, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBodyScan,
  IconBrandArc,
  IconEye,
  IconFlame,
  IconReport,
  IconSettingsCog,
  IconStretching,
} from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  userWorkoutFromRecord: TGetUserWorkoutFromRecord;
  className?: string;
};

export const HistoryWorkoutCard = ({
  userWorkoutFromRecord,
  className,
}: Props) => {
  const [detailOpened, { open: openDetail, close: closeDetail }] =
    useDisclosure();

  const exercises = useMemo(() => {
    return userWorkoutFromRecord.userWorkout.workout.WorkoutExerciseStep.map(
      (exercise) => exercise.exercise,
    );
  }, [userWorkoutFromRecord.userWorkout.workout.WorkoutExerciseStep]);

  const combinedMuscleTargets = useMemo(() => {
    return combineMuscleAffection(
      exercises.map((exercises) => exercises.ExerciseMuscleTarget).flat(),
    );
  }, [exercises]);

  return (
    <>
      <Stack
        gap={0}
        className={cn(
          "group relative overflow-hidden rounded-lg bg-white shadow-sm transition-all",
          className,
        )}
      >
        <Group
          className="my-workout-card-header relative p-2"
          justify="space-between"
        >
          <h3 className="ml-[5rem] self-start text-xl font-bold text-white">
            {userWorkoutFromRecord.userWorkout.workout.title}
          </h3>
          <Tooltip label="Xem chi tiết">
            <IconEye
              size={32}
              color="white"
              className="hover:scale-205 box-content cursor-pointer py-2 transition-all hover:z-10"
              onClick={openDetail}
            />
          </Tooltip>
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
            initialDataForViewMode={generateMuscleState(combinedMuscleTargets)}
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
        <div className="w-full rotate-180 border-b-4 border-white shadow-md" />

        <Group align="center" gap={0} className="p-2">
          <Link
            href={`/workouts/my-workouts/training/${userWorkoutFromRecord.userWorkout.id}`}
            className="font-bold text-primary underline"
          >{`Tiếp tục tập luyện!`}</Link>

          <span className="ml-auto self-end text-lg font-bold leading-none">
            {exercises.reduce((acc, cur) => {
              return acc + cur.caloriesBurned;
            }, 0)}
          </span>
          <Tooltip label="Kcal">
            <IconFlame color="orange" />
          </Tooltip>
        </Group>

        {/* Absolute items */}
        <div className="absolute -start-20 -top-4 z-[8] flex h-60 w-[110px] rotate-45 border-4 border-white bg-white  drop-shadow-lg duration-300" />
        {userWorkoutFromRecord.userWorkout.workout.isAdminCreated ? (
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
        opened={detailOpened}
        onClose={closeDetail}
        title={userWorkoutFromRecord.userWorkout.workout.title}
        classNames={{
          title: "font-bold text-3xl",
        }}
        size="50%"
        radius="lg"
      >
        <Modal.Body className="flex">
          <ToggleSkeleton
            viewMode
            className="z-10 w-2/5 self-center pr-8"
            initialDataForViewMode={generateMuscleState(combinedMuscleTargets)}
          />
          <Stack>
            <Timeline active={3} bulletSize={36} lineWidth={2}>
              <Timeline.Item
                bullet={<IconReport size={20} />}
                title="Số lần tập luyện"
                fz="xl"
                lineVariant="dashed"
              >
                <Text c="dimmed" size="lg">
                  Bạn đã tập luyện tổng cộng{" "}
                  {userWorkoutFromRecord.recordDateTimes.length} lần
                </Text>
                <Text size="sm" mt={4}>
                  {userWorkoutFromRecord.recordDateTimes
                    .map((dateTime) => {
                      const date = format(dateTime, "dd-MM-yyyy");
                      return date;
                    })
                    .join(", ")}
                </Text>
              </Timeline.Item>

              <Timeline.Item
                lineVariant="dashed"
                bullet={<IconStretching size={20} />}
                title="Các bài tập"
                fz="xl"
              >
                <Group gap={0}>
                  {exercises.slice(0, 2).map((exercise, index) => (
                    <Text
                      c="dimmed"
                      size="lg"
                      className="mr-1 last-of-type:mr-0"
                      key={exercise.id}
                    >
                      {exercise.name}
                      {index === 1 ? "" : ","}
                    </Text>
                  ))}
                  {exercises.length > 2 && (
                    <Tooltip
                      position="right-start"
                      label={
                        <Stack gap={0}>
                          {exercises.slice(2).map((exercise) => (
                            <Text key={exercise.id}>{exercise.name}</Text>
                          ))}
                        </Stack>
                      }
                    >
                      <Text component="span" fw="bold" c="dimmed" size="lg">
                        , +{exercises.length - 2}
                      </Text>
                    </Tooltip>
                  )}
                </Group>
                <Text size="sm" mt={4}>
                  Số lượng: {exercises.length}
                </Text>
              </Timeline.Item>

              <Timeline.Item
                title="Nhóm cơ"
                fz="xl"
                bullet={<IconBodyScan size={20} />}
                lineVariant="dashed"
              >
                <Group gap={0}>
                  {combinedMuscleTargets
                    .slice(0, 2)
                    .map((combinedMuscleTarget, index) => (
                      <Text
                        c="dimmed"
                        size="lg"
                        className="mr-1 last-of-type:mr-0"
                        key={combinedMuscleTarget.id}
                      >
                        {getMuscleName(
                          combinedMuscleTarget.name as MuscleTarget,
                        )}
                        {index === 1 ? "" : ","}
                      </Text>
                    ))}
                  {combinedMuscleTargets.length > 2 && (
                    <Tooltip
                      position="right-start"
                      label={
                        <Stack gap={0}>
                          {combinedMuscleTargets
                            .slice(2)
                            .map((combinedMuscleTarget) => (
                              <Text key={combinedMuscleTarget.id}>
                                {getMuscleName(
                                  combinedMuscleTarget.name as MuscleTarget,
                                )}
                              </Text>
                            ))}
                        </Stack>
                      }
                    >
                      <Text component="span" fw="bold" c="dimmed" size="lg">
                        , +{combinedMuscleTargets.length - 2}
                      </Text>
                    </Tooltip>
                  )}
                </Group>
              </Timeline.Item>

              <Timeline.Item
                title="Tổng lượng calo tiêu thụ"
                fz="xl"
                bullet={<IconFlame size={20} />}
              >
                <Group gap={0} align="start">
                  <Text c="dimmed" size="lg">
                    {exercises.reduce((acc, cur) => {
                      return acc + cur.caloriesBurned;
                    }, 0)}{" "}
                  </Text>
                  <IconFlame color="orange" />
                </Group>
                <Text size="sm" mt={4}>
                  Cal/Kcal
                </Text>
              </Timeline.Item>
            </Timeline>
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  );
};
