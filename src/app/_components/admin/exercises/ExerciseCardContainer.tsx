"use client";

import type { ExerciseReturnType } from "@/types";
import { ExerciseCard } from "./ExerciseCard";
import { Button, Grid } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

type Props = {
  exercises: ExerciseReturnType[];
};

export const ExerciseCardContainer = ({ exercises }: Props) => {
  return (
    <div className="space-y-2">
      <Button
        component="a"
        href="/admin/exercises/create"
        className="bg-primary"
      >
        Create Exercise <IconPlus size={16} stroke={2} className="ml-1" />
      </Button>
      <Grid>
        {exercises.map((exercise) => (
          <Grid.Col key={exercise.id} span={{ base: 12, md: 6, lg: 6, xl: 3 }}>
            <ExerciseCard exercise={exercise} />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};
