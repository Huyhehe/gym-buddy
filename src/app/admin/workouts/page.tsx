import { WorkoutCardContainer } from "@/app/_components/admin/workouts/WorkoutCardContainer";
import { api } from "@/trpc/server";

const WorkoutsPage = async () => {
  const workouts = await api.workout.getWorkouts();

  return (
    <div className="box-content space-y-4 p-5">
      <WorkoutCardContainer workouts={workouts} />
    </div>
  );
};

export default WorkoutsPage;
