import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
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
        difficulty,
        mechanic,
        force,
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
            difficulty,
            mechanic,
            force,
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
        const femaleMedia = mediaURLs.male.map((url, index) => ({
          exerciseId: exercise.id,
          index,
          mediaURL: url,
          gender: false,
        }));
        const mediaData = maleMedia.concat(femaleMedia);
        await ctx.db.exerciseExample.createMany({
          data: mediaData,
        });

        const frontMuscleTarget = muscleTargets.front.map((target) => ({
          exerciseId: exercise.id,
          name: target.name,
          affectLevel: target.level,
          side: "front",
        }));
        const backMuscleTarget = muscleTargets.back.map((target) => ({
          exerciseId: exercise.id,
          name: target.name,
          affectLevel: target.level,
          side: "back",
        }));
        await ctx.db.exerciseMuscleTarget.createMany({
          data: frontMuscleTarget.concat(backMuscleTarget),
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
        force,
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
            difficulty,
            mechanic,
            force,
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
        const femaleMedia = mediaURLs.male.map((url, index) => ({
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

        const frontMuscleTarget = muscleTargets.front.map((target) => ({
          exerciseId: id,
          name: target.name,
          affectLevel: target.level,
          side: "front",
        }));
        const backMuscleTarget = muscleTargets.back.map((target) => ({
          exerciseId: id,
          name: target.name,
          affectLevel: target.level,
          side: "back",
        }));
        await ctx.db.exerciseMuscleTarget.deleteMany({
          where: {
            exerciseId: id,
          },
        });
        await ctx.db.exerciseMuscleTarget.createMany({
          data: frontMuscleTarget.concat(backMuscleTarget),
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
});
