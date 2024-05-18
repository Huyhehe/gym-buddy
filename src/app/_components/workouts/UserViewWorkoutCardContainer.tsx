"use client";

import type { WorkoutReturnType } from "@/types";
import { Button, Grid } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { UserViewWorkoutCard } from "./UserViewWorkoutCard";

type Props = {
  workouts: WorkoutReturnType[];
};

export const UserViewWorkoutCardContainer = ({ workouts }: Props) => {
  return (
    <div className="space-y-2">
      <Grid>
        {workouts.map((workout) => (
          <Grid.Col key={workout.id} span={{ base: 12, md: 6, lg: 6, xl: 3 }}>
            <UserViewWorkoutCard workout={workout} />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};
