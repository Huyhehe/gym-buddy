"use client";
import { api } from "@/trpc/react";
import { caloriesBurnedChartDataPreWork } from "@/utils";
import { AreaChart } from "@mantine/charts";
import { LoadingOverlay } from "@mantine/core";

const data = [
  {
    date: "Mar 22",
    Apples: 2890,
    Oranges: 2338,
    Tomatoes: 2452,
  },
  {
    date: "Mar 23",
    Apples: 2756,
    Oranges: 2103,
    Tomatoes: 2402,
  },
  {
    date: "Mar 24",
    Apples: 3322,
    Oranges: 986,
    Tomatoes: 1821,
  },
  {
    date: "Mar 25",
    Apples: 3470,
    Oranges: 2108,
    Tomatoes: 2809,
  },
  {
    date: "Mar 26",
    Apples: 3129,
    Oranges: 1726,
    Tomatoes: 2290,
  },
];

export const CaloriesBurnedChart = () => {
  const { data: workoutRecords, isLoading } =
    api.user.getMyWorkoutRecords.useQuery();
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
      {!!workoutRecords && (
        <AreaChart
          className="h-full"
          data={caloriesBurnedChartDataPreWork(workoutRecords)}
          dataKey="date"
          withGradient
          withLegend
          type="stacked"
          series={[
            {
              name: "totalCaloriesBurned",
              color: "blue.6",
              label: "Calories burned",
            },
          ]}
        />
      )}
    </div>
  );
};
