import { createFormContext } from "@mantine/form";
import { type TManualWorkoutBuildFormValues } from "../_schema";

export const [
  ManualWorkoutBuildFormProvider,
  useManualWorkoutBuildFormContext,
  useManualWorkoutBuildForm,
] = createFormContext<TManualWorkoutBuildFormValues>();
