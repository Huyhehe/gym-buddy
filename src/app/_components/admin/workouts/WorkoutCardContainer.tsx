"use client";

import type { WorkoutReturnType } from "@/types";
import { Button, Grid } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { WorkoutCard } from "./WorkoutCard";

type Props = {
  workouts: WorkoutReturnType[];
};

export const WorkoutCardContainer = ({ workouts }: Props) => {
  return (
    <div className="space-y-2">
      <Button
        component="a"
        href="/admin/workouts/create"
        className="bg-primary"
      >
        Tạo mới chương trình tập{" "}
        <IconPlus size={16} stroke={2} className="ml-1" />
      </Button>

      <Grid>
        {workouts.map((workout) => (
          <Grid.Col key={workout.id} span={{ base: 12, md: 6, lg: 6, xl: 3 }}>
            <WorkoutCard workout={workout} />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};
