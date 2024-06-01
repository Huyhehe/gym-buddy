import type { AppRouter } from "@/server/api/root";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type RouterInput = inferRouterInputs<AppRouter>;

// EXERCISE route
export type ExerciseReturnType =
  RouterOutput["exercise"]["getExercises"][number];

export type SingleExerciseReturnType = RouterOutput["admin"]["getExerciseByID"];

export type ExerciseMuscleTargetReturnType =
  RouterOutput["exercise"]["getExercises"][number]["ExerciseMuscleTarget"][number];

// WORKOUT route
export type WorkoutReturnType =
  RouterOutput["workout"]["getWorkouts"][number] & {
    isBookmarked?: boolean;
  };

export type SingleWorkoutReturnType = RouterOutput["workout"]["getWorkoutByID"];

export type UserWorkoutReturnType =
  RouterOutput["workout"]["getUserWorkouts"][number];

// ADMIN route
export type AdminSingleWorkoutReturnType =
  RouterOutput["admin"]["getWorkoutByID"];

// CLIENT route
export type EquipmentReturnType =
  RouterOutput["client"]["getEquipments"][number];

export type GeneratedWorkoutReturnType =
  RouterOutput["client"]["generateWorkout"];

// USER route
export type UserReturnType = RouterOutput["user"]["getUser"];

export type UserWorkoutRecordReturnType =
  RouterOutput["user"]["getMyWorkoutRecords"][number];
