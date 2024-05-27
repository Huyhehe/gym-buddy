import type { ExerciseMuscleTargetReturnType } from "@/types";
import groupBy from "lodash/groupBy";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const compareString = (a: string, b: string) => {
  return a === b;
};

export const generateLevelText = (level: number) => {
  switch (level) {
    case 1:
      return "Beginner";
    case 2:
      return "Intermediate";
    case 3:
      return "Advanced";
    default:
      return "All";
  }
};

export const generateColorByAffectLevel = (affectLevel: number, bg = false) => {
  switch (affectLevel) {
    case 1:
      return bg ? "bg-yellow-200" : "text-yellow-200";
    case 2:
      return bg ? "bg-orange-400" : "text-orange-400";
    case 3:
      return bg ? "bg-red-600" : "text-red-600";
    default:
      return bg ? "bg-neutral-200" : "text-neutral-200";
  }
};
export const generateColorDifficultyLevel = (
  affectLevel: number,
  bg = false,
) => {
  switch (affectLevel) {
    case 1:
      return bg ? "bg-green-500" : "text-green-500";
    case 2:
      return bg ? "bg-orange-400" : "text-orange-400";
    case 3:
      return bg ? "bg-red-600" : "text-red-600";
    default:
      return bg ? "bg-neutral-200" : "text-neutral-200";
  }
};

export const combineMuscleAffection = (
  muscleTargets: ExerciseMuscleTargetReturnType[],
) => {
  const finalMuscleTargets: ExerciseMuscleTargetReturnType[] = [];
  const muscleTargetsGroupObject = groupBy(muscleTargets, "name");

  for (const [, value] of Object.entries(muscleTargetsGroupObject)) {
    const muscleTarget = value.reduce((acc, obj) => {
      return {
        ...acc,
        affectLevel: acc.affectLevel + obj.affectLevel,
      };
    });

    if (muscleTarget.affectLevel > 3) {
      muscleTarget.affectLevel = 3;
    }

    finalMuscleTargets.push(muscleTarget);
  }

  return finalMuscleTargets;
};

export const generateMuscleState = (
  muscleTargets: ExerciseMuscleTargetReturnType[],
) => {
  const muscleStateGroupObject = groupBy(muscleTargets, "side");
  const front = (
    muscleStateGroupObject.front?.map((muscle) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      [muscle.name]: muscle.affectLevel,
    })) ?? []
  ).reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});
  const back = (
    muscleStateGroupObject.back?.map((muscle) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      [muscle.name]: muscle.affectLevel,
    })) ?? []
  ).reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});

  return {
    front,
    back,
  };
};

type CalculateCaloriesNeededPerDayArgs = {
  age: number;
  height: number;
  weight: number;
  workoutFrequency: number;
  workoutTarget: number;
  gender: boolean;
};
export const calculateCaloriesNeededPerDay = ({
  age,
  height,
  weight,
  workoutFrequency,
  workoutTarget,
  gender,
}: CalculateCaloriesNeededPerDayArgs) => {
  const brmStandard = gender
    ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;

  const caloriesNeededPerDay = brmStandard * workoutFrequency + workoutTarget;

  return caloriesNeededPerDay < 1200 ? 1200 : caloriesNeededPerDay;
};

type CalculateMacrosArgs = {
  nutrientString: string;
  calories: number;
  mealPerDay: number;
};
export const calculateMacros = ({
  nutrientString,
  calories,
  mealPerDay,
}: CalculateMacrosArgs) => {
  const [carb, protein, fat] = nutrientString.split("/").map(Number);
  const carbPerDay = (calories * (Number(carb) / 100)) / 4;
  const proteinPerDay = (calories * (Number(protein) / 100)) / 4;
  const fatPerDay = (calories * (Number(fat) / 100)) / 9;

  return {
    carb: {
      percent: carb,
      perDay: carbPerDay?.toFixed(0),
      perMeal: (carbPerDay / mealPerDay)?.toFixed(0),
    },
    protein: {
      percent: protein,
      perDay: proteinPerDay?.toFixed(0),
      perMeal: (proteinPerDay / mealPerDay)?.toFixed(0),
    },
    fat: {
      percent: fat,
      perDay: fatPerDay?.toFixed(0),
      perMeal: (fatPerDay / mealPerDay)?.toFixed(0),
    },
  };
};

export const getGoalLabel = (goal: string) => {
  switch (goal) {
    case "lose-weight":
      return "Lose Weight";
    case "gain-strength":
      return "Gain Strength";
    case "gain-muscle":
      return "Gain Muscle";
    default:
      return "All";
  }
};
