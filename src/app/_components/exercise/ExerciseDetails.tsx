"use client";

import type { ExerciseReturnType } from "@/types";
import { Grid, Group, Stack } from "@mantine/core";

type Props = {
  exercise: ExerciseReturnType;
};

export const ExerciseDetails = ({ exercise }: Props) => {
  return (
    <Stack gap={2} className="mb-8 rounded-lg bg-white">
      <Stack gap={0} className="overflow-hidden rounded-t-lg">
        <h1 className="bg-primary px-4 py-3 text-2xl font-bold text-white">
          {exercise?.name}
        </h1>
        <Grid>
          {exercise?.ExerciseExample?.map(
            (example) =>
              example.gender && (
                <Grid.Col span={6} key={example?.id}>
                  <video
                    src={example?.mediaURL ?? ""}
                    className="w-full rounded-b-lg object-cover"
                    autoPlay
                    loop
                    muted
                  />
                </Grid.Col>
              ),
          )}
        </Grid>
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