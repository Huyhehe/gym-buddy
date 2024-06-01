"use client";

import { api } from "@/trpc/react";
import { MyWorkoutCardContainer } from "./_components/MyWorkoutCardContainer";
import { useGlobalContext } from "../workout-builder/_context/global-context";
import { useEffect } from "react";

const MyWorkoutPage = () => {
  const { setIsBackdropOpen } = useGlobalContext();
  const {
    data: userWorkouts = [],
    refetch,
    isLoading,
  } = api.workout.getUserWorkouts.useQuery();

  useEffect(() => {
    setIsBackdropOpen(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

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
