import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirst({
      where: {
        id: ctx.session?.user?.id,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    return user;
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
});
