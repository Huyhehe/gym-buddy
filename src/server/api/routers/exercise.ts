import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const exerciseRouter = createTRPCRouter({
  getExercises: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input = {} }) => {
      const { search = "" } = input;
      const exercises = await ctx.db.exercise.findMany({
        where: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        include: {
          ExerciseExample: true,
          ExerciseMuscleTarget: true,
          ExerciseStep: true,
        },
      });

      return exercises;
    }),
});
