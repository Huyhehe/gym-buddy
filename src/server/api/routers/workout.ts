import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const workoutRouter = createTRPCRouter({
  getWorkouts: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          isAdminQuery: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input = {} }) => {
      const { search = "", isAdminQuery = false } = input;
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

      if (isAdminQuery) {
        return workouts;
      }

      const user = await ctx.db.user.findFirst({
        where: {
          id: ctx.session?.user?.id,
        },
      });

      if (!user) {
        return workouts;
      }

      const userWorkouts = await ctx.db.userWorkout.findMany({
        where: {
          userId: user.id,
        },
      });

      const returnWorkouts = workouts.map((workout) => {
        if (
          userWorkouts.some(
            (userWorkout) => userWorkout.workoutId === workout.id,
          )
        ) {
          return {
            ...workout,
            isBookmarked: true,
          };
        }
        return workout;
      });

      return returnWorkouts;
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
  bookMarkWorkout: protectedProcedure
    .input(
      z.object({
        workoutId: z.string(),
        isBookmarked: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          id: ctx.session?.user?.id,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (input.isBookmarked) {
        const existedBookmarkedWorkout = await ctx.db.userWorkout.findFirst({
          where: {
            userId: user.id,
            AND: {
              workoutId: input.workoutId,
            },
          },
        });
        if (!!existedBookmarkedWorkout) {
          throw new Error("Workout already bookmarked");
        }

        const bookmarkedWorkout = await ctx.db.userWorkout.create({
          data: {
            userId: user.id,
            workoutId: input.workoutId,
          },
        });

        return bookmarkedWorkout;
      }

      await ctx.db.userWorkout.deleteMany({
        where: {
          userId: user.id,
          AND: {
            workoutId: input.workoutId,
          },
        },
      });
    }),
  unBookMarkWorkout: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          id: ctx.session?.user?.id,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      await ctx.db.userWorkout.deleteMany({
        where: {
          userId: user.id,
          AND: {
            workoutId: input,
          },
        },
      });
    }),
});
