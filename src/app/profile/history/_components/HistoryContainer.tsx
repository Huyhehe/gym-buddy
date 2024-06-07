"use client";
import { ToggleSkeleton } from "@/app/_components/MuscleSkeleton/ToggleSkeleton";
import { CaloriesBurnedChart } from "@/app/_components/profile/CaloriesBurnedChart";
import { MuscleFocusRadarChart } from "@/app/_components/profile/MuscleFocusRadarChart";
import { api } from "@/trpc/react";
import {
  combineMuscleAffection,
  generateMuscleState,
  generateMuscleTargetForChart,
} from "@/utils";
import { Loader, Stack } from "@mantine/core";

export const HistoryContainer = () => {
  const { data: WR } = api.user.getMyWorkoutRecords.useQuery();
  return (
    <Stack>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <CaloriesBurnedChart workoutRecords={WR?.workoutRecords} />
        </div>
        <div className="col-span-4">
          <Stack gap={0} className="h-fit  rounded-xl bg-white p-4">
            <span className="mb-2 text-sm font-semibold text-gray-500">
              Các nhóm cơ bạn đã tập trong 30 ngày gần nhất
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
