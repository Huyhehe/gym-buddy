"use client";

import { useGlobalContext } from "@/app/workouts/workout-builder/_context/global-context";
import type { ExerciseReturnType } from "@/types";
import { Group, Image, Stack } from "@mantine/core";
import { useMemo } from "react";

type Props = {
  exercise: ExerciseReturnType;
};

export const ExerciseDetails = ({ exercise }: Props) => {
  const { isMale } = useGlobalContext();
  const medias = useMemo(() => {
    return exercise.ExerciseExample.filter((ex) => ex.gender === isMale);
  }, [exercise.ExerciseExample, isMale]);

  return (
    <Stack gap={2} className="mb-8 rounded-lg bg-white">
      <Stack gap={0} className="overflow-hidden rounded-t-lg">
        <h1 className="bg-primary px-4 py-3 text-2xl font-bold text-white">
          {exercise?.name}
        </h1>
        <div className="grid grid-cols-12 gap-4">
          {medias.map((example) => (
            <div
              key={example?.id}
              className="col-span-12 @xl:col-span-6 [&_.media]:last:rounded-lg @xl:[&_.media]:last:rounded-t-none"
            >
              {example.mediaURL.includes("videos") ? (
                <video
                  src={example?.mediaURL ?? ""}
                  className="media w-full rounded-b-lg object-cover"
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <Image
                  alt={example.mediaURL}
                  src={example.mediaURL ?? ""}
                  className="media rounded-b-lg"
                />
              )}
            </div>
          ))}
        </div>
      </Stack>

      <Stack gap={2} className="my-4 -ml-2">
        {exercise?.ExerciseStep.map((step, index) => (
          <Group gap={8} key={step.id} wrap="nowrap">
            <div className="rounded-full bg-white p-2">
              <div className="flex aspect-square w-12 items-center justify-center rounded-full bg-primary leading-3 text-white">
                {index + 1}
              </div>
            </div>
            <span>{step.description}</span>
          </Group>
        ))}
      </Stack>
    </Stack>
  );
};
