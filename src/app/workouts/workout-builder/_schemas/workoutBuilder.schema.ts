import { z } from "zod";

export const workoutBuilderSchema = z.object({
  name: z.string(),
  gender: z.boolean(),
  age: z.number().min(13).max(100),
  goal: z.enum(["lose", "muscle", "strength"]),
  currentLevel: z.number().int().min(0).max(3),
  muscleTarget: z.object({
    front: z.array(z.string()),
    back: z.array(z.string()),
  }),
  currentStep: z.number().int().min(0).max(5),
});

export type TWorkoutBuilderFormValues = z.infer<typeof workoutBuilderSchema>;
