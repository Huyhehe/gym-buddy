import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const workoutRouter = createTRPCRouter({
  getWorkouts: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input = {} }) => {
      const { search = "" } = input;
      const workouts = await ctx.db.workout.findMany({
        where: {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        include: {
          WorkoutExerciseStep: {
            include: {
              exercise: {
                include: {
                  ExerciseMuscleTarget: true,
                },
              },
            },
          },
        },
      });

      return workouts;
    }),
  getWorkoutByID: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const workout = await ctx.db.workout.findFirst({
        where: {
          id: input,
        },
        include: {
          WorkoutExerciseStep: {
            include: {
              exercise: {
                include: {
                  ExerciseMuscleTarget: true,
                  ExerciseExample: true,
                  ExerciseStep: true,
                },
              },
            },
          },
        },
      });

      return workout;
    }),
});
