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
              equipmentId: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input = {} }) => {
      const {
        search = "",
        filterObject = {
          muscleTarget: undefined,
          equipmentId: undefined,
        },
      } = input;
      const exercises = await ctx.db.exercise.findMany({
        where: {
          name: {
            contains: search,
            mode: "insensitive",
          },
          ...(!!filterObject.muscleTarget
            ? {
                ExerciseMuscleTarget: {
                  some: {
                    name: {
                      contains: filterObject.muscleTarget,
                      mode: "insensitive",
                    },
                  },
                },
              }
            : {}),
          equipmentId: {
            contains: filterObject.equipmentId,
            mode: "insensitive",
          },
        },
        include: {
          ExerciseExample: true,
          ExerciseMuscleTarget: true,
          ExerciseStep: true,
          Equipment: true,
        },
      });

      return exercises;
    }),
});
