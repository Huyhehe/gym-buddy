import type { TExerciseFormValues } from "@/app/admin/_schemas";
import type { SingleExerciseReturnType } from "@/types";

export const generateInitialExerciseFormValues = (
  exercise: SingleExerciseReturnType,
): TExerciseFormValues => {
  const {
    ExerciseExample,
    ExerciseMuscleTarget,
    ExerciseStep,
    force,
    difficulty,
    ...rest
  } = exercise!;
  const steps: TExerciseFormValues["steps"] = ExerciseStep?.map((step) => ({
    key: step.id,
    value: step.description,
  }));
  const mediaURLs: TExerciseFormValues["mediaURLs"] = {
    male: ExerciseExample?.filter((example) => example.gender).map(
      (example) => example.mediaURL,
    ),
    female: ExerciseExample?.filter((example) => !example.gender).map(
      (example) => example.mediaURL,
    ),
  };
  const muscleTargets: TExerciseFormValues["muscleTargets"] = {
    front: ExerciseMuscleTarget?.filter(
      (target) => target.side === "front",
    ).map((target) => ({
      name: target.name,
      level: target.affectLevel,
    })),
    back: ExerciseMuscleTarget?.filter((target) => target.side === "back").map(
      (target) => ({
        name: target.name,
        level: target.affectLevel,
      }),
    ),
  };

  return {
    ...rest,
    ...(force ? { force } : null),
    difficulty: difficulty.toString(),
    steps,
    mediaURLs,
    muscleTargets,
    equipmentId: exercise!.equipmentId,
  };
};
