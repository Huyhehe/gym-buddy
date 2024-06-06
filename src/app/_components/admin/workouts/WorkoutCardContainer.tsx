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

      <div className="grid grid-cols-12 gap-4 @container">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="col-span-6 @5xl:col-span-4 @[1290px]:col-span-3"
          >
            <WorkoutCard workout={workout} />
          </div>
        ))}
      </div>
    </div>
  );
};
