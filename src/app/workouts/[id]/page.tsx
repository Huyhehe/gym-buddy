import { WorkoutDetailContainer } from "@/app/_components/workouts/WorkoutDetailContainer";
import { api } from "@/trpc/server";

const UserViewWorkoutDetailPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const workout = await api.workout.getWorkoutByID(params.id);

  return (
    <div className="p-6">
      {!!workout && <WorkoutDetailContainer workout={workout} />}
    </div>
  );
};

export default UserViewWorkoutDetailPage;
