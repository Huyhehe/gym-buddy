import type { AppRouter } from "@/server/api/root";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type RouterInput = inferRouterInputs<AppRouter>;

// EXERCISE route
export type ExerciseReturnType =
  RouterOutput["exercise"]["getExercises"][number];

export type ExerciseMuscleTargetReturnType =
  RouterOutput["exercise"]["getExercises"][number]["ExerciseMuscleTarget"][number];
