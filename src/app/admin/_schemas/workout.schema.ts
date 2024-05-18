import { z } from "zod";

export const workoutCreateFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: "Name should have at least 2 letters" }),
  description: z.string(),
  level: z.string().min(1),
  target: z.string().min(5),
  thumbnail: z.string(),
  exercises: z.array(z.string()),
});

export type TWorkoutFormValues = z.infer<typeof workoutCreateFormSchema>;
