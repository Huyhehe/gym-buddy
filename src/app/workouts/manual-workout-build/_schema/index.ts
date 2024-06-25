import { z } from "zod";

export const manualWorkoutBuildFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: "Tên bài tập phải có ít nhất 2 kí tự" }),
  exercises: z.array(z.string()).min(1),
});

export type TManualWorkoutBuildFormValues = z.infer<
  typeof manualWorkoutBuildFormSchema
>;
