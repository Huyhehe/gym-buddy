import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  type TWorkoutFormValues,
  exerciseCreateFormSchema,
  workoutCreateFormSchema,
} from "@/app/admin/_schemas";
import { z } from "zod";

export const adminRouter = createTRPCRouter({
  createExercise: protectedProcedure
    .input(exerciseCreateFormSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        sets,
        reps,
        repsUnit,
        difficulty,
        mechanic,
        equipmentId,
        goal,
        force,
        caloriesBurned,
        steps,
        mediaURLs,
        muscleTargets,
      } = input;

      try {
        const exercise = await ctx.db.exercise.create({
          data: {
            name,
            sets,
            reps,
            repsUnit,
            difficulty: Number(difficulty),
            mechanic,
            equipmentId,
            force,
            goal,
            caloriesBurned,
          },
        });

        const stepsData = steps.map((step, index) => ({
          exerciseId: exercise.id,
          index,
          description: step.value,
        }));
        await ctx.db.exerciseStep.createMany({
          data: stepsData,
        });

        const maleMedia = mediaURLs.male.map((url, index) => ({
          exerciseId: exercise.id,
          index,
          mediaURL: url,
          gender: true,
        }));
        const femaleMedia = mediaURLs.female.map((url, index) => ({
          exerciseId: exercise.id,
          index,
          mediaURL: url,
          gender: false,
        }));
        const mediaData = maleMedia.concat(femaleMedia);
        await ctx.db.exerciseExample.createMany({
          data: mediaData,
        });

        const newMuscleTargets = muscleTargets.map((target) => ({
          exerciseId: exercise.id,
          name: target.name,
          affectLevel: target.level,
        }));

        await ctx.db.exerciseMuscleTarget.createMany({
          data: newMuscleTargets,
        });
      } catch (error) {
        throw new Error((error as Error)?.message);
      }
    }),
  updateExercise: protectedProcedure
    .input(exerciseCreateFormSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        name,
        sets,
        reps,
        difficulty,
        mechanic,
        equipmentId,
        force,
        caloriesBurned,
        steps,
        mediaURLs,
        muscleTargets,
      } = input;

      try {
        if (!id) throw new Error("Can't find any matched exercise!");
        await ctx.db.exercise.update({
          where: {
            id,
          },
          data: {
            name,
            sets,
            reps,
            difficulty: Number(difficulty),
            mechanic,
            equipmentId,
            force,
            caloriesBurned,
          },
        });

        const stepsData = steps.map((step, index) => ({
          exerciseId: id,
          index,
          description: step.value,
        }));

        await ctx.db.exerciseStep.deleteMany({
          where: {
            exerciseId: id,
          },
        });
        await ctx.db.exerciseStep.createMany({
          data: stepsData,
        });

        const maleMedia = mediaURLs.male.map((url, index) => ({
          exerciseId: id,
          index,
          mediaURL: url,
          gender: true,
        }));
        const femaleMedia = mediaURLs.female.map((url, index) => ({
          exerciseId: id,
          index,
          mediaURL: url,
          gender: false,
        }));
        await ctx.db.exerciseExample.deleteMany({
          where: {
            exerciseId: id,
          },
        });
        await ctx.db.exerciseExample.createMany({
          data: maleMedia.concat(femaleMedia),
        });

        // const frontMuscleTarget = muscleTargets.front.map((target) => ({
        //   exerciseId: id,
        //   name: target.name,
        //   affectLevel: target.level,
        //   side: "front",
        // }));
        // const backMuscleTarget = muscleTargets.back.map((target) => ({
        //   exerciseId: id,
        //   name: target.name,
        //   affectLevel: target.level,
        //   side: "back",
        // }));
        const newMuscleTargets = muscleTargets.map((target) => ({
          exerciseId: id,
          name: target.name,
          affectLevel: target.level,
        }));
        await ctx.db.exerciseMuscleTarget.deleteMany({
          where: {
            exerciseId: id,
          },
        });
        await ctx.db.exerciseMuscleTarget.createMany({
          data: newMuscleTargets,
        });
      } catch (error) {
        throw new Error((error as Error)?.message);
      }
    }),
  deleteExercise: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.exerciseExample.deleteMany({
          where: {
            exerciseId: input,
          },
        });

        await ctx.db.exerciseMuscleTarget.deleteMany({
          where: {
            exerciseId: input,
          },
        });

        await ctx.db.exerciseStep.deleteMany({
          where: {
            exerciseId: input,
          },
        });

        await ctx.db.workoutExerciseStep.deleteMany({
          where: {
            exerciseId: input,
          },
        });

        await ctx.db.exercise.delete({
          where: {
            id: input,
          },
        });
      } catch (error) {
        throw new Error((error as Error)?.message);
      }
    }),
  getExerciseByID: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const exercise = await ctx.db.exercise.findFirst({
          where: {
            id: input,
          },
          include: {
            ExerciseExample: true,
            ExerciseMuscleTarget: true,
            ExerciseStep: true,
          },
        });

        return exercise;
      } catch (error) {
        throw new Error((error as Error)?.message);
      }
    }),
  createWorkout: protectedProcedure
    .input(workoutCreateFormSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { title, description, exercises, thumbnail, level, target } =
          input;

        const workout = await ctx.db.workout.create({
          data: {
            title,
            description,
            thumbnail,
            level: Number(level),
            target,
            isAdminCreated: true,
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
      } catch (error) {
        throw new Error((error as Error)?.message);
      }
    }),
  updateWorkout: protectedProcedure
    .input(workoutCreateFormSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, title, description, exercises, thumbnail, level, target } =
          input;

        const workout = await ctx.db.workout.update({
          where: {
            id,
          },
          data: {
            title,
            description,
            thumbnail,
            level: Number(level),
            target,
          },
        });

        await ctx.db.workoutExerciseStep.deleteMany({
          where: {
            workoutId: id,
          },
        });

        if (!workout) throw new Error("Can't find any matched workout!");

        const workoutExerciseSteps = exercises.map((exercise, index) => ({
          workoutId: workout.id,
          exerciseId: exercise,
          index,
        }));

        await ctx.db.workoutExerciseStep.createMany({
          data: workoutExerciseSteps,
        });
      } catch (error) {
        throw new Error((error as Error)?.message);
      }
    }),
  deleteWorkout: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.workoutExerciseStep.deleteMany({
          where: {
            workoutId: input,
          },
        });

        await ctx.db.workout.delete({
          where: {
            id: input,
          },
        });
      } catch (error) {
        throw new Error((error as Error)?.message);
      }
    }),
  getWorkoutByID: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
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

        const workoutToReturn: TWorkoutFormValues = {
          id: workout?.id,
          title: workout?.title ?? "",
          description: workout?.description ?? "",
          level: workout?.level.toString() ?? "",
          target: workout?.target ?? "",
          thumbnail: workout?.thumbnail ?? "",
          exercises:
            workout?.WorkoutExerciseStep.map((step) => step.exerciseId) ?? [],
        };

        return workoutToReturn;
      } catch (error) {
        throw new Error((error as Error)?.message);
      }
    }),
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      include: {
        sessions: true,
      },
    });

    return users.filter((user) => user.id !== ctx.session.user.id).reverse();
  }),
  getPagingUsers: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        skip: z.number().nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
        direction: z.enum(["forward", "backward"]), // optional, useful for bi-directional query
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, skip, limit } = input;

      const users = await ctx.db.user.findMany({
        take: limit ?? 10,
        skip: skip ?? 0,
        orderBy: {
          id: input.direction === "forward" ? "asc" : "desc",
        },
      });
      return users;
    }),
  toggleBlockUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        isBlocked: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, isBlocked } = input;

      await ctx.db.user.update({
        where: {
          id: userId,
        },
        data: {
          isBlocked,
        },
      });
    }),
});
