import { api } from "@/trpc/server";
import { ExerciseDetails } from "../_components/exercise/ExerciseDetails";
import { GridContainer } from "../_components/GridContainer";
import { OptionFilterContainer } from "../_components/exercise/OptionFilterContainer";
import { ExerciseDetailContainer } from "../_components/exercise/ExerciseDetailContainer";

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
    <div className="p-6">
      <GridContainer>
        <ExerciseDetailContainer span={8}>
          {!!exercises.length ? (
            exercises.map((exercise) => (
              <ExerciseDetails key={exercise.id} exercise={exercise} />
            ))
          ) : (
            <div>No matching exercises found</div>
          )}
        </ExerciseDetailContainer>
        <OptionFilterContainer equipments={equipments} />
      </GridContainer>
    </div>
  );
};

export default ExercisePage;
