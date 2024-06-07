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

  const muscleTargets: TExerciseFormValues["muscleTargets"] =
    ExerciseMuscleTarget.map((exMuscleTarget) => ({
      name: exMuscleTarget.name,
      level: exMuscleTarget.affectLevel,
    }));

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
