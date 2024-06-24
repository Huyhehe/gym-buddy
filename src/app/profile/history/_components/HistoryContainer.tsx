"use client";
import { ToggleSkeleton } from "@/app/_components/MuscleSkeleton/ToggleSkeleton";
import { CaloriesBurnedChart } from "@/app/_components/profile/CaloriesBurnedChart";
import { MuscleFocusRadarChart } from "@/app/_components/profile/MuscleFocusRadarChart";
import { api } from "@/trpc/react";
import {
  combineMuscleAffection,
  generateMuscleState,
  generateMuscleTargetForChart,
  getUserWorkoutFromRecords,
} from "@/utils";
import { Loader, Select, Stack } from "@mantine/core";
import { groupBy } from "lodash";
import { useMemo, useState } from "react";
import { HistoryWorkoutCard } from "./HistoryWorkoutCard";

export const HistoryContainer = () => {
  const [gteNum, setGteNum] = useState(7);
  const { data: WR } = api.user.getMyWorkoutRecords.useQuery({
    gte: gteNum,
  });
  // const userWorkouts = useMemo(() => {
  //   const workoutRecordGroupObject = groupBy
  //   return WR?.workoutRecords.map((workoutRecord) => {})
  // })
  WR?.workoutRecords &&
    console.log(getUserWorkoutFromRecords(WR?.workoutRecords));
  return (
    <Stack>
      <Select
        data={[
          {
            label: "7 ngày gần nhất",
            value: "7",
          },
          {
            label: "30 ngày gần nhất",
            value: "30",
          },
          {
            label: "1 năm gần nhất",
            value: "365",
          },
        ]}
        defaultValue={"7"}
        onChange={(e) => {
          setGteNum(Number(e));
        }}
        className="w-fit"
        radius="md"
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 grid grid-cols-1 gap-4">
          <CaloriesBurnedChart
            workoutRecords={WR?.workoutRecords}
            gte={gteNum}
          />
          <div className="grid grid-cols-2 gap-4 @container">
            {WR?.workoutRecords ? (
              getUserWorkoutFromRecords(WR?.workoutRecords).map(
                (userWorkoutFromRecord) => (
                  <HistoryWorkoutCard
                    key={userWorkoutFromRecord.userWorkout.id}
                    userWorkoutFromRecord={userWorkoutFromRecord}
                    className="col-span-2 @4xl:col-span-1 @6xl:col-span-1 @[1300px]:col-span-1"
                  />
                ),
              )
            ) : (
              <div className="col-span-2 flex h-[400px] items-center justify-center">
                <Loader className="text-center" />
              </div>
            )}
          </div>
        </div>
        <div className="col-span-4">
          <Stack gap={0} className="h-fit  rounded-xl bg-white p-4">
            <span className="mb-2 text-sm font-semibold text-gray-500">
              Các nhóm cơ bạn đã tập trong {gteNum} ngày gần nhất
            </span>
            {!!WR ? (
              <>
                <ToggleSkeleton
                  viewMode
                  className="flex w-full justify-center py-4"
                  initialDataForViewMode={generateMuscleState(
                    combineMuscleAffection(WR.muscleTargets),
                  )}
                  // female={userInfo.gender}
                />
                <div className="grid grid-cols-2">
                  <MuscleFocusRadarChart
                    data={generateMuscleTargetForChart({
                      muscleObject: generateMuscleState(
                        combineMuscleAffection(WR.muscleTargets, true),
                      ),
                      isFront: true,
                    })}
                  />
                  <MuscleFocusRadarChart
                    data={generateMuscleTargetForChart({
                      muscleObject: generateMuscleState(
                        combineMuscleAffection(WR.muscleTargets, true),
                      ),
                    })}
                  />
                </div>
              </>
            ) : (
              <Loader className="self-center justify-self-center" />
            )}
          </Stack>
        </div>
      </div>
    </Stack>
  );
};
