import { WorkoutDetailContainer } from "@/app/_components/workouts/WorkoutDetailContainer";
import { api } from "@/trpc/server";

const WorkoutTrainingPage = async ({ params }: { params: { id: string } }) => {
  const userWorkout = await api.workout.getUserWorkoutByID(params.id);
  return (
    <div className="p-6 @container/workout-detail">
      {!!userWorkout && (
        <WorkoutDetailContainer
          workout={userWorkout.workout}
          userWorkoutId={userWorkout.id}
          isTraining
        />
      )}
    </div>
  );
};

export default WorkoutTrainingPage;
