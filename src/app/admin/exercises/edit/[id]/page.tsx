import { ExerciseCreateForm } from "@/app/_components/admin/exercises/ExerciseCreateForm";

import { api } from "@/trpc/server";

const ExerciseEditPage = async ({ params }: { params: { id: string } }) => {
  const exercise = await api.admin.getExerciseByID(params.id);

  return (
    <div className="p-6">
      {!!exercise && <ExerciseCreateForm exerciseFromData={exercise} />}
    </div>
  );
};

export default ExerciseEditPage;
