import type {
  ExerciseMuscleTargetReturnType,
  GetUserStatsReturnType,
  MuscleTarget,
  TGetUserWorkoutFromRecord,
  UserWorkoutRecordReturnType,
} from "@/types";
import groupBy from "lodash/groupBy";

import { notifications } from "@mantine/notifications";
import { clsx, type ClassValue } from "clsx";
import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import {
  BACK_MUSCLE_TARGET,
  FRONT_MUSCLE_TARGET,
  GOAL_LABEL,
  LEVEL_LABEL,
  mechanicOptions,
} from "./constants";
import { isNil } from "lodash";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const compareString = (a: string, b: string) => {
  return a === b;
};

export const generateLevelText = (level: number) => {
  switch (level) {
    case 1:
      return LEVEL_LABEL.novice;
    case 2:
      return LEVEL_LABEL.beginner;
    case 3:
      return LEVEL_LABEL.intermediate;
    default:
      return LEVEL_LABEL.advanced;
  }
};

export const generateRepUnitText = (unit: string) => {
  switch (unit) {
    case "rep":
      return "lần";
    case "second":
      return "giây";
    case "minute":
      return "phút";
    default:
      return "";
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
      return bg ? "bg-blue-600" : "text-blue-600";
    case 2:
      return bg ? "bg-green-500" : "text-green-500";
    case 3:
      return bg ? "bg-orange-400" : "text-orange-400";
    case 4:
      return bg ? "bg-red-600" : "text-red-600";
    default:
      return bg ? "bg-neutral-200" : "text-neutral-200";
  }
};

export const combineMuscleAffection = (
  muscleTargets: ExerciseMuscleTargetReturnType[],
  isUnlimited = false,
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

    if (muscleTarget.affectLevel > 3 && !isUnlimited) {
      muscleTarget.affectLevel = 3;
    }

    finalMuscleTargets.push(muscleTarget);
  }

  return finalMuscleTargets;
};

export const generateMuscleState = (
  muscleTargets: ExerciseMuscleTargetReturnType[],
) => {
  return (
    muscleTargets?.map((muscle) => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      [muscle.name]: muscle.affectLevel,
    })) ?? []
  ).reduce((acc, obj) => {
    return { ...acc, ...obj };
  }, {});
};

type GenerateMuscleTargetForChartArgs = {
  muscleObject: Record<string, number>;
  isFront?: boolean;
};
type GenerateMuscleTargetForChartReturnValue = {
  muscle: string;
  value: number;
}[];

export const generateMuscleTargetForChart = ({
  muscleObject,
  isFront = false,
}: GenerateMuscleTargetForChartArgs): GenerateMuscleTargetForChartReturnValue => {
  const initialFrontMaleState = {
    abdominals: 0,
    obliques: 0,
    forearms: 0,
    biceps: 0,
    shoulders: 0,
    traps: 0,
    chest: 0,
    quads: 0,
    calves: 0,
  };
  const initialBackMaleState = {
    hamstrings: 0,
    lowerback: 0,
    glutes: 0,
    lats: 0,
    "traps-middle": 0,
    traps: 0,
    "rear-shoulders": 0,
    calves: 0,
    triceps: 0,
    forearms: 0,
  };

  const returnMuscleObject = [];

  if (isFront) {
    const frontMuscleObject = {
      ...initialFrontMaleState,
      ...muscleObject,
    };
    for (const [key, value] of Object.entries(frontMuscleObject)) {
      if (FRONT_MUSCLE_TARGET.includes(key))
        returnMuscleObject.push({
          muscle: key,
          value,
        });
    }

    return returnMuscleObject;
  }

  const backMuscleObject = {
    ...initialBackMaleState,
    ...muscleObject,
  };
  for (const [key, value] of Object.entries(backMuscleObject)) {
    if (BACK_MUSCLE_TARGET.includes(key))
      returnMuscleObject.push({
        muscle: key,
        value,
      });
  }

  return returnMuscleObject;
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
      return GOAL_LABEL.loseWeight;
    case "gain-strength":
      return GOAL_LABEL.gainStrength;
    case "gain-muscle":
      return GOAL_LABEL.gainMuscle;
    default:
      return "Tất cả";
  }
};
export const getMechanicLabel = (mechanic: string) => {
  return mechanicOptions.find((value) => value.value === mechanic)?.label;
};

export const caloriesBurnedChartDataPreWork = (
  workoutRecords: UserWorkoutRecordReturnType[],
) => {
  const data = workoutRecords.map((record) => {
    const date = new Date(record.createdAt).toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
    });
    const totalCaloriesBurned =
      record.userWorkout.workout.WorkoutExerciseStep.reduce((acc, step) => {
        return acc + step.exercise.caloriesBurned;
      }, 0);

    return {
      date,
      totalCaloriesBurned,
    };
  });

  const groupedData = groupBy(data, "date");
  const finalData = Object.entries(groupedData).map(([key, value]) => {
    return {
      date: key,
      totalCaloriesBurned: value.reduce((acc, obj) => {
        return acc + obj.totalCaloriesBurned;
      }, 0),
    };
  });

  return finalData;
};

type TShowNotification = {
  title?: ReactNode;
  message?: ReactNode;
  status?: "success" | "error";
};
export const showNoti = ({
  title,
  message,
  status = "success",
}: TShowNotification) => {
  const isSuccess = status === "success";
  const baseTitle = isSuccess ? "Thành công" : "Không thành công";
  const baseMessage = isSuccess ? "Thành công" : "Không thành công";
  notifications.show({
    title: title ?? baseTitle,
    message: message ?? baseMessage,
    color: isSuccess ? "green" : "red",
  });
};

export const getUserWorkoutFromRecords = (
  workoutRecords: UserWorkoutRecordReturnType[],
): TGetUserWorkoutFromRecord[] => {
  const workoutRecordGroupObject = groupBy(workoutRecords, "userWorkoutId");
  const userWorkouts: TGetUserWorkoutFromRecord[] = [];
  for (const [, value] of Object.entries(workoutRecordGroupObject)) {
    if (!value?.[0]) continue;

    const recordDateTimes = value.map((rdt) => rdt.createdAt);
    userWorkouts.push({
      userWorkout: value?.[0]?.userWorkout,
      recordDateTimes,
    });
  }

  return userWorkouts;
};

export const getGenderLabel = (gender?: boolean | null) => {
  if (isNil(gender)) return null;
  return gender ? "Nam" : "Nữ";
};

export const removeAccent = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const stringDeepCompare = (left: string, right: string) => {
  return removeAccent(left).toLowerCase() === removeAccent(right).toLowerCase();
};

export const stringDeepIncludesCheck = (parent: string, child: string) => {
  return removeAccent(parent)
    .toLowerCase()
    .includes(removeAccent(child).toLowerCase());
};

export const workoutCreationHistoryDataPreWork = (
  initialData: GetUserStatsReturnType,
) => {
  const userWorkouts = initialData.userWorkouts.map((d) => {
    const date = new Date(d.createdAt).toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
    });
    return {
      date,
      ...d,
    };
  });

  const groupedData = groupBy(userWorkouts, "date");
  const finalData = Object.entries(groupedData).map(([key, value]) => {
    return {
      date: key,
      system: value.filter((v) => v.workout.isAdminCreated).length,
      self: value.filter((v) => !v.workout.isAdminCreated).length,
    };
  });

  return finalData;
};

export const getEquipmentName = (name: string) => {
  switch (name) {
    case "Featured":
      return "Nổi bật";
    case "Barbell":
      return "Tạ đòn";
    case "Dumbbells":
      return "Tạ tay";
    case "Bodyweight":
      return "Trọng lượng cơ thể";
    case "Machine":
      return "Máy tập";
    case "Medicine Ball":
      return "Bóng y tế";
    case "Kettlebells":
      return "Tạ ấm";
    case "Stretches":
      return "Bài tập giãn cơ";
    case "Cables":
      return "Dây cáp";
    case "Band":
      return "Dây kháng lực";
    case "Plate":
      return "Đĩa tạ";
    case "TRX":
      return "Dây TRX";
    case "Yoga":
      return "Yoga";
    case "Bosu Ball":
      return "Bóng Bosu";
    case "Vitruvian":
      return "Vitruvian";
    case "Cardio":
      return "Cardio";
    case "Smith Machine":
      return "Máy Smith";
    default:
      return "Unknown";
  }
};

export const getMuscleName = (name: string): string => {
  switch (name) {
    case "abdominals":
      return "Cơ bụng";
    case "obliques":
      return "Cơ liên sườn";
    case "biceps":
      return "Cơ tay trước";
    case "shoulders":
      return "Cơ vai";
    case "chest":
      return "Cơ ngực";
    case "quads":
      return "Cơ đùi trước";
    case "hamstrings":
      return "Cơ đùi sau";
    case "lowerback":
      return "Cơ lưng dưới";
    case "glutes":
      return "Cơ mông";
    case "lats":
      return "Cơ lưng rộng";
    case "traps-middle":
      return "Cơ cầu vai giữa";
    case "traps":
      return "Cơ cầu vai";
    case "rear-shoulders":
      return "Cơ vai sau";
    case "calves":
      return "Cơ bắp chân";
    case "triceps":
      return "Cơ tay sau";
    case "forearms":
      return "Cơ cẳng tay";
    default:
      return "Unknown";
  }
};
