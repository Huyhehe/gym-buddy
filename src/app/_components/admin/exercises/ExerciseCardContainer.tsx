"use client";

import type { ExerciseReturnType } from "@/types";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { ExerciseCard } from "./ExerciseCard";

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
        Tạo bài tập mới <IconPlus size={16} stroke={2} className="ml-1" />
      </Button>
      <div className="grid grid-cols-12 gap-4 @container">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="col-span-6 @5xl:col-span-4 @[1300px]:col-span-3"
          >
            <ExerciseCard exercise={exercise} />
          </div>
        ))}
      </div>
    </div>
  );
};
