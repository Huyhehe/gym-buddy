"use client";

import type { UserWorkoutReturnType } from "@/types";
import { MyWorkoutCard } from "./MyWorkoutCard";

type Props = {
  userWorkouts: UserWorkoutReturnType[];
  refetch: () => void;
};

export const MyWorkoutCardContainer = ({ userWorkouts, refetch }: Props) => {
  console.log({ userWorkouts });
  return (
    <div className="@container grid grid-cols-12 gap-4">
      {userWorkouts.map((userWorkout) => {
        return (
          <MyWorkoutCard
            key={userWorkout.id}
            userWorkout={userWorkout}
            refetch={refetch}
          />
        );
      })}
    </div>
  );
};
