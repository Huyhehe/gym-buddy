import { api } from "@/trpc/server";
import { ExerciseDetails } from "../_components/exercise/ExerciseDetails";
import { GridContainer } from "../_components/GridContainer";
import { OptionFilterContainer } from "../_components/exercise/OptionFilterContainer";
import { ExerciseDetailContainer } from "../_components/exercise/ExerciseDetailContainer";
import { EmptyData } from "../_components/EmptyData";

const ExercisePage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { muscle?: string; equipment?: string };
}) => {
  const exercises = await api.exercise.getExercises({
    filterObject: {
      muscleTarget: searchParams.muscle,
      equipmentId: searchParams.equipment,
    },
  });

  const equipments = await api.client.getEquipments();

  return (
    <div className="p-6 @container/exercise-page">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 @5xl/exercise-page:col-span-8">
          {!!exercises.length ? (
            exercises.map((exercise) => (
              <ExerciseDetails key={exercise.id} exercise={exercise} />
            ))
          ) : (
            <EmptyData />
          )}
        </div>
        <OptionFilterContainer
          equipments={equipments}
          className="col-span-4 hidden @5xl/exercise-page:block"
        />
      </div>
    </div>
  );
};

export default ExercisePage;
