"use client";

export const useCalorieStorage = () => {
  const setCaloriesNeed = (caloriesNeed: number) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("caloriesNeed", String(caloriesNeed));
    }
  };
  const getCaloriesNeed = () => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("caloriesNeed"));
    }
  };

  return {
    setCaloriesNeed,
    getCaloriesNeed,
  };
};
