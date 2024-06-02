import { WorkoutCreateForm } from "@/app/_components/admin/workouts/WorkoutCreateForm";
import { api } from "@/trpc/server";

const WorkoutEditPage = async ({ params }: { params: { id: string } }) => {
  const workout = await api.admin.getWorkoutByID(params.id);
  return (
    <div className="p-6">
      {!!workout && <WorkoutCreateForm workoutFromData={workout} />}
    </div>
  );
};

export default WorkoutEditPage;
