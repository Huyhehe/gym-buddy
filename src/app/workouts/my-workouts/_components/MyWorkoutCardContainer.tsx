"use client";

import type { UserWorkoutReturnType } from "@/types";
import { Grid, Group } from "@mantine/core";
import { MyWorkoutCard } from "./MyWorkoutCard";

type Props = {
  userWorkouts: UserWorkoutReturnType[];
};

export const MyWorkoutCardContainer = ({ userWorkouts }: Props) => {
  console.log({ userWorkouts });
  return (
    <Grid>
      {userWorkouts.map((userWorkout) => {
        return (
          <Grid.Col
            key={userWorkout.id}
            span={{
              base: 12,
              md: 6,
              lg: 4,
              xl: 3,
            }}
          >
            <MyWorkoutCard userWorkout={userWorkout} />
          </Grid.Col>
        );
      })}
    </Grid>
  );
};
