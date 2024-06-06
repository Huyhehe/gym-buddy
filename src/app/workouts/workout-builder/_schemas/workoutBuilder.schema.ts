import { z } from "zod";

export const workoutBuilderSchema = z.object({
  gender: z.boolean(),
  age: z.number().min(13).max(100),
  goal: z.string(),
  currentLevel: z.number().int().min(1).max(4),
  muscleTarget: z.object({
    front: z.array(z.string()).min(1),
    back: z.array(z.string()),
  }),
  currentStep: z.number().int().min(0).max(5),
});

export type TWorkoutBuilderFormValues = z.infer<typeof workoutBuilderSchema>;
