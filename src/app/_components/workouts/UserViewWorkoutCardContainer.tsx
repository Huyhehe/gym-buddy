"use client";

import type { WorkoutReturnType } from "@/types";
import { UserViewWorkoutCard } from "./UserViewWorkoutCard";

type Props = {
  workouts: WorkoutReturnType[];
};

export const UserViewWorkoutCardContainer = ({ workouts }: Props) => {
  return (
    <div className="grid grid-cols-12 gap-2 @container">
      {workouts.map((workout) => (
        <UserViewWorkoutCard
          key={workout.id}
          workout={workout}
          className="col-span-12 h-full @4xl:col-span-6 @6xl:col-span-4 @[110rem]:col-span-3"
        />
      ))}
    </div>
  );
};
