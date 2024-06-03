import { z } from "zod";

export const profileFormSchema = z.object({
  age: z.number().int().min(13).max(99),
  caloriesNeed: z.number().int().min(1200).max(6000),
  height: z.number().int().min(100).max(250),
  weight: z.number().int().min(30).max(300),
});

export type TProfileFormSchema = z.infer<typeof profileFormSchema>;
