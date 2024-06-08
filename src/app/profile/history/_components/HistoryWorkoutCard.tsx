import { ToggleSkeleton } from "@/app/_components/MuscleSkeleton/ToggleSkeleton";
import NetBg from "@/assets/images/net-bg.jpg";
import { TGetUserWorkoutFromRecord } from "@/types";
import { cn, combineMuscleAffection, generateMuscleState } from "@/utils";
import { Group, Modal, Stack, Text, Timeline, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandArc,
  IconEye,
  IconFlame,
  IconGitBranch,
  IconGitCommit,
  IconGitPullRequest,
  IconMessageDots,
  IconSettingsCog,
} from "@tabler/icons-react";
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
              className="box-content cursor-pointer py-2 transition-all hover:z-10 hover:scale-125"
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
          title: "font-bold text-xl",
        }}
        size="50%"
        radius="lg"
      >
        <Modal.Body className="flex">
          <ToggleSkeleton
            viewMode
            className="z-10 w-1/3 self-center pr-8"
            initialDataForViewMode={generateMuscleState(
              combineMuscleAffection(
                exercises
                  .map((exercises) => exercises.ExerciseMuscleTarget)
                  .flat(),
              ),
            )}
          />
          <Stack>
            <Timeline active={3} bulletSize={24} lineWidth={2}>
              <Timeline.Item
                bullet={<IconGitBranch size={12} />}
                title="New branch"
                lineVariant="dashed"
              >
                <Text c="dimmed" size="sm">
                  You&apos;ve created new branch{" "}
                  <Text variant="link" component="span" inherit>
                    fix-notifications
                  </Text>{" "}
                  from master
                </Text>
                <Text size="xs" mt={4}>
                  2 hours ago
                </Text>
              </Timeline.Item>

              <Timeline.Item
                lineVariant="dashed"
                bullet={<IconGitCommit size={12} />}
                title="Commits"
              >
                <Text c="dimmed" size="sm">
                  You&apos;ve pushed 23 commits to
                  <Text variant="link" component="span" inherit>
                    fix-notifications branch
                  </Text>
                </Text>
                <Text size="xs" mt={4}>
                  52 minutes ago
                </Text>
              </Timeline.Item>

              <Timeline.Item
                title="Pull request"
                bullet={<IconGitPullRequest size={12} />}
                lineVariant="dashed"
              >
                <Text c="dimmed" size="sm">
                  You&apos;ve submitted a pull request
                  <Text variant="link" component="span" inherit>
                    Fix incorrect notification message (#187)
                  </Text>
                </Text>
                <Text size="xs" mt={4}>
                  34 minutes ago
                </Text>
              </Timeline.Item>

              <Timeline.Item
                title="Code review"
                bullet={<IconMessageDots size={12} />}
              >
                <Text c="dimmed" size="sm">
                  <Text variant="link" component="span" inherit>
                    Robert Gluesticker
                  </Text>{" "}
                  left a code review on your pull request
                </Text>
                <Text size="xs" mt={4}>
                  12 minutes ago
                </Text>
              </Timeline.Item>
            </Timeline>
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  );
};
