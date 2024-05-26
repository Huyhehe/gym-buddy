import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const exerciseRouter = createTRPCRouter({
  getExercises: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          filterObject: z
            .object({
              muscleTarget: z.string().optional(),
              equipment: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input = {} }) => {
      const {
        search = "",
        filterObject = {
          muscleTarget: "",
          equipment: "",
        },
      } = input;
      const exercises = await ctx.db.exercise.findMany({
        where: {
          name: {
            contains: search,
            mode: "insensitive",
          },
          ExerciseMuscleTarget: {
            some: {
              name: {
                contains: filterObject.muscleTarget,
                mode: "insensitive",
              },
            },
          },
          equipment: {
            contains: filterObject.equipment,
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
