"use client";

import type { UserWorkoutReturnType } from "@/types";
import { MyWorkoutCard } from "./MyWorkoutCard";

type Props = {
  userWorkouts: UserWorkoutReturnType[];
  refetch: () => void;
};

export const MyWorkoutCardContainer = ({ userWorkouts, refetch }: Props) => {
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
    </div>
  );
};
