"use client";
import { api } from "@/trpc/react";
import type { UserWorkoutRecordReturnType } from "@/types";
import { caloriesBurnedChartDataPreWork } from "@/utils";
import { AreaChart } from "@mantine/charts";
import { LoadingOverlay } from "@mantine/core";

type Props = {
  workoutRecords?: UserWorkoutRecordReturnType[];
  gte?: number;
};

export const CaloriesBurnedChart = ({ workoutRecords, gte = 7 }: Props) => {
  const { data: WR, isLoading } = api.user.getMyWorkoutRecords.useQuery(
    { gte },
    {
      enabled: !workoutRecords,
    },
  );
  // console.log({ workoutRecords });

  // console.log(
  //   !!workoutRecords && caloriesBurnedChartDataPreWork(workoutRecords),
  // );
  return (
    <div className="relative h-[300px] rounded-xl bg-white p-4">
      <LoadingOverlay
        visible={isLoading}
        color="gray"
        opacity={0.8}
        zIndex={10}
      />
      {(!!WR?.workoutRecords || !!workoutRecords) && (
        <AreaChart
          className="h-full"
          data={caloriesBurnedChartDataPreWork(
            WR?.workoutRecords ?? workoutRecords ?? [],
          )}
          dataKey="date"
          withGradient
          withLegend
          type="stacked"
          series={[
            {
              name: "totalCaloriesBurned",
              color: "blue.6",
              label: "Calories đã đốt cháy",
            },
          ]}
        />
      )}
    </div>
  );
};
