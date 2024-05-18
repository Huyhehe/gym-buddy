import { ExerciseCardContainer } from "@/app/_components/admin/exercises/ExerciseCardContainer";
import { api } from "@/trpc/server";

const ExercisesPage = async () => {
  const exercises = await api.exercise.getExercises();

  return (
    <div className="box-content space-y-4 p-5">
      <ExerciseCardContainer exercises={exercises} />
    </div>
  );
};

export default ExercisesPage;
