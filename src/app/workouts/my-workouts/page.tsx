"use client";

import { api } from "@/trpc/react";
import { MyWorkoutCardContainer } from "./_components/MyWorkoutCardContainer";

const MyWorkoutPage = () => {
  const { data: userWorkouts = [], refetch } =
    api.workout.getUserWorkouts.useQuery();

  const handleRefetchUserWorkout = () => {
    void refetch();
  };

  return (
    <div className="p-6">
      <MyWorkoutCardContainer
        userWorkouts={userWorkouts}
        refetch={handleRefetchUserWorkout}
      />
    </div>
  );
};

export default MyWorkoutPage;
