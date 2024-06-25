import type { ExerciseReturnType } from "@/types";
import { Grid } from "@mantine/core";
import { SelectableExerciseCard } from "./SelectableExerciseCard";

type Props = {
  exercises: ExerciseReturnType[];
  selectedExercises: string[];
  onChange: (exercises: string[]) => void;
};

export const ExerciseSelectBoard = ({
  exercises,
  selectedExercises,
  onChange,
}: Props) => {
  // const { values } = useWorkoutFormContext();

  const handleSelect = (exercise: ExerciseReturnType, selected: boolean) => {
    if (selected) {
      const newSelectedExercises = [...selectedExercises, exercise.id];
      onChange(newSelectedExercises);
    } else {
      onChange(selectedExercises.filter((id) => id !== exercise.id));
    }
  };

  return (
    <div>
      <Grid>
        {exercises.map((exercise) => (
          <Grid.Col key={exercise.id} span={{ base: 12, md: 6, lg: 6, xl: 3 }}>
            <SelectableExerciseCard
              initialSelected={selectedExercises.some(
                (selectedExercise) => selectedExercise === exercise.id,
              )}
              exercise={exercise}
              onSelect={handleSelect}
            />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};
