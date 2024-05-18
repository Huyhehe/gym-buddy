import { WorkoutDetailContainer } from "@/app/_components/workouts/WorkoutDetailContainer";
import { api } from "@/trpc/server";

const UserViewWorkoutDetailPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const workout = await api.workout.getWorkoutByID(params.id);

  return <div>{!!workout && <WorkoutDetailContainer workout={workout} />}</div>;
};

export default UserViewWorkoutDetailPage;
