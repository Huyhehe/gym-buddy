import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { isNil } from "lodash";

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
              level: z.string().optional(),
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
          level: "4",
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
            contains:
              filterObject.equipmentId !== "0" ? filterObject.equipmentId : "",
            mode: "insensitive",
          },
          ...(!isNil(filterObject.level) && {
            difficulty: {
              lte: Number(filterObject.level),
            },
          }),
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
