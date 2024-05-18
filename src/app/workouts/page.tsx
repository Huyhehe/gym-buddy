import { api } from "@/trpc/server";
import { UserViewWorkoutCardContainer } from "../_components/workouts/UserViewWorkoutCardContainer";

const UserViewWorkoutsPage = async () => {
  const workouts = await api.workout.getWorkouts();

  return (
    <div>
      <UserViewWorkoutCardContainer workouts={workouts} />
    </div>
  );
};

export default UserViewWorkoutsPage;