import type { ExerciseReturnType } from "@/types";
import { Grid } from "@mantine/core";
import { SelectableExerciseCard } from "./SelectableExerciseCard";
import { useState } from "react";

type Props = {
  exercises: ExerciseReturnType[];
  onChange: (exercises: string[]) => void;
};

export const ExerciseSelectBoard = ({ exercises, onChange }: Props) => {
  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseReturnType[]
  >([]);

  const handleSelect = (exercise: ExerciseReturnType, selected: boolean) => {
    if (selected) {
      setSelectedExercises((prev) => {
        const newSelectedExercises = [...prev, exercise];
        onChange(newSelectedExercises.map((exercise) => exercise.id));

        return newSelectedExercises;
      });
    } else {
      setSelectedExercises((prev) => {
        const newSelectedExercises = prev.filter(
          (selectedExercise) => selectedExercise.id !== exercise.id,
        );
        onChange(newSelectedExercises.map((exercise) => exercise.id));

        return newSelectedExercises;
      });
    }
  };

  return (
    <div>
      <Grid>
        {exercises.map((exercise) => (
          <Grid.Col key={exercise.id} span={{ base: 12, md: 6, lg: 6, xl: 3 }}>
            <SelectableExerciseCard
              exercise={exercise}
              onSelect={handleSelect}
            />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};
