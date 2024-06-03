import { subDays } from "date-fns";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { profileFormSchema } from "@/app/profile/_schemas";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const thirtyDaysAgo = subDays(new Date(), 30);

    const user = await ctx.db.user.findFirst({
      where: {
        id: ctx.session?.user?.id,
      },
      include: {
        WorkoutRecord: {
          where: {
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
          include: {
            userWorkout: {
              include: {
                workout: {
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
                },
              },
            },
          },
        },
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const { WorkoutRecord, ...restUser } = user;

    const trainedExercises = WorkoutRecord.map((workoutRecord) => {
      return workoutRecord.userWorkout.workout.WorkoutExerciseStep;
    }).flat();

    const muscleTargets = trainedExercises
      .map((trainedExercise) => trainedExercise.exercise.ExerciseMuscleTarget)
      .flat();

    const returnedUser = {
      ...restUser,
      muscleTargets,
    };

    return returnedUser;
  }),
  saveWorkoutRecord: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;
      await ctx.db.workoutRecord.create({
        data: {
          userId,
          userWorkoutId: input,
        },
      });
    }),
  getMyWorkoutRecords: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    return ctx.db.workoutRecord.findMany({
      where: {
        userId,
      },
      include: {
        userWorkout: {
          include: {
            workout: {
              include: {
                WorkoutExerciseStep: {
                  select: {
                    exercise: {
                      select: {
                        caloriesBurned: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }),
  updatePersonalInfo: protectedProcedure
    .input(profileFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { age, caloriesNeed, height, weight } = input;
      const currentUserId = ctx.session.user.id;

      await ctx.db.user.update({
        where: {
          id: currentUserId,
        },
        data: {
          age,
          caloriesNeed,
          height,
          weight,
        },
      });
    }),
});
