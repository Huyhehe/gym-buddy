import { subDays } from "date-fns";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { profileFormSchema } from "@/app/profile/_schemas";

export const userRouter = createTRPCRouter({
  getMe: protectedProcedure.query(async ({ ctx }) => {
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
    if (user.isBlocked) {
      throw new Error("Bạn đã bị khóa sử dụng tính năng này");
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
  getMyWorkoutRecords: protectedProcedure
    .input(
      z
        .object({
          gte: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      const workoutRecords = await ctx.db.workoutRecord.findMany({
        where: {
          userId,
          ...(input?.gte
            ? {
                createdAt: {
                  gte: subDays(new Date(), input?.gte),
                },
              }
            : undefined),
        },
        include: {
          userWorkout: {
            include: {
              workout: {
                include: {
                  WorkoutExerciseStep: {
                    select: {
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
      });

      const trainedExercises = workoutRecords
        .map((workoutRecord) => {
          return workoutRecord.userWorkout.workout.WorkoutExerciseStep;
        })
        .flat();

      const muscleTargets = trainedExercises
        .map((trainedExercise) => trainedExercise.exercise.ExerciseMuscleTarget)
        .flat();

      const returnedWR = {
        workoutRecords,
        muscleTargets,
      };

      return returnedWR;
    }),
  updatePersonalInfo: protectedProcedure
    .input(profileFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { age, caloriesNeed, height, weight, gender } = input;
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
          ...(!!gender && {
            gender: gender === "true",
          }),
        },
      });
    }),
});
