import { workoutBuilderSchema } from "@/app/workouts/workout-builder/_schemas";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const clientRouter = createTRPCRouter({
  getEquipments: publicProcedure.query(async ({ ctx }) => {
    const equipments = await ctx.db.equipment.findMany();
    return equipments;
  }),
  generateWorkout: publicProcedure
    .input(workoutBuilderSchema)
    .mutation(async ({ ctx, input }) => {
      const { gender, age, goal, currentLevel, muscleTarget } = input;
      console.log(muscleTarget);

      const exercises = await ctx.db.exercise.findMany({
        where: {
          ExerciseMuscleTarget: {
            some: {
              name: {
                in: muscleTarget,
              },
            },
          },
          AND: {
            difficulty: {
              lte: currentLevel,
            },
            goal: goal,
          },
        },
        take: 6,
        include: {
          ExerciseExample: true,
          ExerciseMuscleTarget: true,
          Equipment: true,
        },
      });

      return exercises;
    }),
});
