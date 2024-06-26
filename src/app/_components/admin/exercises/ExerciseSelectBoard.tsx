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
    <div className="grid grid-cols-12 gap-4 @container/select-board">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="@4xl/select-board:col-span-4 @6xl/select-board:col-span-3"
        >
          <SelectableExerciseCard
            initialSelected={selectedExercises.some(
              (selectedExercise) => selectedExercise === exercise.id,
            )}
            exercise={exercise}
            onSelect={handleSelect}
          />
        </div>
      ))}
    </div>
  );
};
