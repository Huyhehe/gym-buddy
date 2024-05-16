import { api } from "@/trpc/server";
import Link from "next/link";
import { ExerciseCardContainer } from "@/app/_components/admin/exercises/ExerciseCardContainer";

const ExercisesPage = async () => {
  const exercises = await api.exercise.getExercises();

  return (
    <div className="box-content space-y-4 p-2">
      <ExerciseCardContainer exercises={exercises} />
    </div>
  );
};

export default ExercisesPage;
