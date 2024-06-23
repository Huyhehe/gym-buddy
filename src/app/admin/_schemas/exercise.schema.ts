import { z } from "zod";

export const exerciseCreateFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Tên bài tập phải có ít nhất 2 kí tự" }),
  sets: z
    .number({ message: "Phải có ít nhất 1 hiệp tập" })
    .int()
    .min(1, { message: "Phải có ít nhất 1 hiệp tập" }),
  reps: z
    .number({ message: "Phải có ít nhất 3 lần tập" })
    .int()
    .min(3, { message: "Phải có ít nhất 3 lần tập" }),
  repsUnit: z.string(),
  difficulty: z.string().min(1),
  mechanic: z.string().min(1),
  goal: z.string().min(1),
  force: z.string().optional(),
  equipmentId: z.string(),
  caloriesBurned: z
    .number({ message: "Phải tiêu thụ ít nhất 20 kcal" })
    .int()
    .min(20, "Phải tiêu thụ ít nhất 20 kcal"),
  steps: z.array(
    z.object({
      value: z.string().min(1, "Bước tập luyện không được để trống"),
      key: z.string(),
    }),
  ),
  mediaURLs: z.object({
    male: z.array(z.string()),
    female: z.array(z.string()),
  }),
  muscleTargets: z
    .array(
      z.object({
        name: z.string(),
        level: z.number(),
      }),
    )
    .min(1),
});

export type TExerciseFormValues = z.infer<typeof exerciseCreateFormSchema>;
