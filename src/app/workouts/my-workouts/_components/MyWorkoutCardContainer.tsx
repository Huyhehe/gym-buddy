"use client";

import { Stack } from "@mantine/core";
import { MyWorkoutCard } from "./MyWorkoutCard";
import { api } from "@/trpc/react";
import { IconCirclePlus } from "@tabler/icons-react";
import { useGlobalContext } from "../../workout-builder/_context/global-context";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const MyWorkoutCardContainer = () => {
  const { setIsBackdropOpen } = useGlobalContext();
  const router = useRouter();

  const {
    data: userWorkouts = [],
    isLoading,
    refetch,
  } = api.workout.getUserWorkouts.useQuery(undefined, {});

  useEffect(() => {
    setIsBackdropOpen(isLoading);
  }, [isLoading]);

  return (
    <div className="grid grid-cols-12 gap-4 @container">
      {userWorkouts.map((userWorkout) => {
        return (
          <MyWorkoutCard
            key={userWorkout.id}
            userWorkout={userWorkout}
            refetch={refetch}
          />
        );
      })}

      <Stack
        className="col-span-12 min-h-[400px] cursor-pointer items-center justify-center rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out hover:scale-90 hover:bg-gray-200 @4xl:col-span-6 @6xl:col-span-4 @[1300px]:col-span-3"
        onClick={() => void router.push("/workouts/workout-builder")}
      >
        <IconCirclePlus className="text-primary" size={150} />
        <h1 className="text-3xl font-bold text-primary">
          Tạo chương trình tập
        </h1>
      </Stack>
    </div>
  );
};
