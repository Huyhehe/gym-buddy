import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { workoutCreateFormSchema } from "@/app/admin/_schemas";

export const workoutRouter = createTRPCRouter({
  getWorkouts: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          isAdminQuery: z.boolean().optional(),
          levelOptions: z.array(z.number()).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input = {} }) => {
      const { search = "", isAdminQuery = false, levelOptions = [] } = input;
      const workouts = await ctx.db.workout.findMany({
        where: {
          title: {
            contains: search,
            mode: "insensitive",
          },
          isAdminCreated: true,
          level: {
            in: !!levelOptions.length ? levelOptions : undefined,
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

      if (!ctx.session?.user.id) {
        return workouts;
      }

      const userWorkouts = await ctx.db.userWorkout.findMany({
        where: {
          userId: ctx.session?.user.id,
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
                  Equipment: true,
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
  saveGeneratedWorkout: protectedProcedure
    .input(workoutCreateFormSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.id) {
          throw new Error("User not found!");
        }
        const { title, description, exercises, thumbnail, level, target } =
          input;

        const workout = await ctx.db.workout.create({
          data: {
            title,
            description,
            thumbnail,
            level: Number(level),
            target,
          },
        });

        const workoutExerciseSteps = exercises.map((exercise, index) => ({
          workoutId: workout.id,
          exerciseId: exercise,
          index,
        }));

        await ctx.db.workoutExerciseStep.createMany({
          data: workoutExerciseSteps,
        });

        await ctx.db.userWorkout.create({
          data: {
            userId: ctx.session?.user?.id,
            workoutId: workout.id,
          },
        });
      } catch (error) {
        throw new Error((error as Error)?.message);
      }
    }),
  getUserWorkouts: protectedProcedure
    .input(z.string().optional())
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          id: ctx.session?.user?.id,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const userWorkouts = await ctx.db.userWorkout.findMany({
        where: {
          userId: user.id,
        },
        include: {
          workout: {
            include: {
              WorkoutExerciseStep: {
                include: {
                  exercise: {
                    include: {
                      ExerciseMuscleTarget: true,
                      Equipment: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return userWorkouts;
    }),
  getUserWorkoutByID: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const userWorkout = await ctx.db.userWorkout.findFirst({
          where: {
            id: input,
          },
          include: {
            workout: {
              include: {
                WorkoutExerciseStep: {
                  include: {
                    exercise: {
                      include: {
                        ExerciseMuscleTarget: true,
                        ExerciseExample: true,
                        ExerciseStep: true,
                        Equipment: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        return userWorkout;
      } catch (error) {
        throw new Error((error as Error)?.message);
      }
    }),
  removeMyWorkout: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userWorkout = await ctx.db.userWorkout.findFirst({
        where: {
          id: input,
        },
        include: {
          workout: {
            select: {
              isAdminCreated: true,
            },
          },
          WorkoutRecord: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!userWorkout) {
        throw new Error("User workout not found");
      }

      if (!!userWorkout.WorkoutRecord.length) {
        await ctx.db.workoutRecord.deleteMany({
          where: {
            userWorkoutId: userWorkout.id,
          },
        });
      }

      await ctx.db.userWorkout.delete({
        where: {
          id: input,
        },
      });

      if (!userWorkout.workout.isAdminCreated) {
        await ctx.db.workoutExerciseStep.deleteMany({
          where: {
            workoutId: userWorkout.workoutId,
          },
        });
        await ctx.db.workout.delete({
          where: {
            id: userWorkout.workoutId,
          },
        });
      }
    }),
});
