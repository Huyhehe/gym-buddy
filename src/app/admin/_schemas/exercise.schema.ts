import { z } from "zod";

export const exerciseCreateFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name should have at least 2 letters" }),
  sets: z.number().int().min(1, { message: "At least 1 set is required" }),
  reps: z.number().int().min(3, { message: "At least 3 reps are required" }),
  repsUnit: z.string(),
  difficulty: z.string().min(1),
  mechanic: z.string().min(1),
  goal: z.string().min(1),
  force: z.string().optional(),
  equipmentId: z.string(),
  caloriesBurned: z.number().int().min(100),
  steps: z.array(
    z.object({
      value: z.string(),
      key: z.string(),
    }),
  ),
  mediaURLs: z.object({
    male: z.array(z.string()),
    female: z.array(z.string()),
  }),
  muscleTargets: z.object({
    front: z.array(
      z.object({
        name: z.string(),
        level: z.number(),
      }),
    ),
    back: z.array(
      z.object({
        name: z.string(),
        level: z.number(),
      }),
    ),
  }),
});

export type TExerciseFormValues = z.infer<typeof exerciseCreateFormSchema>;
