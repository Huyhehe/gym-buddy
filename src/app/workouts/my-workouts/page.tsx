import { api } from "@/trpc/server";
import { MyWorkoutCardContainer } from "./_components/MyWorkoutCardContainer";

const MyWorkoutPage = async () => {
  const userWorkouts = await api.workout.getUserWorkouts();

  return (
    <div>
      <MyWorkoutCardContainer userWorkouts={userWorkouts} />
    </div>
  );
};

export default MyWorkoutPage;
