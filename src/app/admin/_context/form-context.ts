import { createFormContext } from "@mantine/form";
import type { TWorkoutFormValues } from "../_schemas";

export const [WorkoutFormProvider, useWorkoutFormContext, useWorkoutForm] =
  createFormContext<TWorkoutFormValues>();
