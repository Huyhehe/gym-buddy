import { createFormContext } from "@mantine/form";
import type { TWorkoutBuilderFormValues } from "../_schemas";

export const [
  WorkoutBuilderFormProvider,
  useWorkoutBuilderFormContext,
  useWorkoutBuilderForm,
] = createFormContext<TWorkoutBuilderFormValues>();
