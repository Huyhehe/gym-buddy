"use client";

import { SingleToggleSkeleton } from "@/app/_components/MuscleSkeleton/SingleToggleSkeleton";
import { Button, Select, Stack } from "@mantine/core";
import { useWorkoutBuilderFormContext } from "../_context";

type Props = {
  female?: boolean;
};

export const MuscleTarget = ({ female = false }: Props) => {
  const { values, setFieldValue } = useWorkoutBuilderFormContext();

  return (
    <Stack align="center">
      {/* <Select className="self-start" /> */}
      <SingleToggleSkeleton
        className="w-full @4xl/generate-workout:w-2/5"
        female={female}
        initialDataForViewMode={{
          ...(() => {
            const muscleTargets: Record<string, boolean> = {};
            for (const target of values.muscleTarget) {
              muscleTargets[target] = true;
            }
            return muscleTargets;
          })(),
        }}
        onReturnValue={(values) => {
          const muscleTargets = [];
          for (const [key, value] of Object.entries(values)) {
            if (value) {
              muscleTargets.push(key);
            }
          }

          setFieldValue("muscleTarget", muscleTargets);
        }}
      />
      <Button
        color="var(--color-primary)"
        className="box-content px-8 py-4 text-xl @4xl/generate-workout:self-end"
        type="submit"
        onClick={() => setFieldValue("currentStep", values.currentStep + 1)}
      >
        Tạo chương trình tập
      </Button>
    </Stack>
  );
};
