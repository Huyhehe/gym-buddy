import { HomeIcon } from "@/assets/icons/HomeIcon";
import { RoutinesIcon } from "@/assets/icons/RoutinesIcon";
import { ToolsIcon } from "@/assets/icons/ToolsIcon";
import { WorkoutIcon } from "@/assets/icons/WorkoutIcon";
import type { SelectOption, SidebarLinks } from "@/types";

export const sidebarLinks: SidebarLinks[] = [
  {
    title: "Trang chủ",
    href: "/",
    icon: HomeIcon,
  },
  {
    title: "Chương trình tập",
    href: "/workouts",
    icon: WorkoutIcon,
    subLinks: [
      {
        title: "Những chương trình tập",
        href: "",
      },
      {
        title: "Chương trình tập của tôi",
        href: "/my-workouts",
      },
      {
        title: "Tự xây dựng chương trình tập",
        href: "/workout-builder",
      },
    ],
  },
  {
    title: "Routines",
    href: "/routines",
    icon: RoutinesIcon,
  },
  {
    title: "Tools",
    href: "/tools",
    icon: ToolsIcon,
    subLinks: [
      {
        title: "Calorie Calculator",
        href: "/calorie-calculator",
      },
      {
        title: "Macro Calculator",
        href: "/macro-calculator",
      },
      {
        title: "One Rep Max Calculator",
        href: "/one-rep-max-calculator",
      },
    ],
  },
  {
    title: "Quản lý",
    href: "/admin",
    adminOnly: true,
    subLinks: [
      {
        title: "Quản lý người dùng",
        href: "/users",
      },
      {
        title: "Quản lý bài tập",
        href: "/exercises",
      },
      {
        title: "Quản lý chương trình tập",
        href: "/workouts",
      },
      {
        title: "Routines",
        href: "/routines",
      },
    ],
  },
];

export const repsUnitOptions: SelectOption[] = [
  { label: "Rep(s)", value: "rep" },
  { label: "Second(s)", value: "second" },
  { label: "Minute(s)", value: "minute" },
];
export const mechanicOptions: SelectOption[] = [
  { label: "Compound", value: "compound" },
  { label: "Isolation", value: "isolation" },
];

export const levelOptions: SelectOption[] = [
  { label: "Novice", value: "1" },
  { label: "Beginner", value: "2" },
  { label: "Intermediate", value: "3" },
  { label: "Advanced", value: "4" },
];

export const targetOptions: SelectOption[] = [
  {
    label: "Lose Weight",
    value: "lose-weight",
  },
  {
    label: "Gain Strength",
    value: "gain-strength",
  },
  {
    label: "Gain Muscle",
    value: "gain-muscle",
  },
];

export const FRONT_MUSCLE_TARGET = [
  "abdominals",
  "obliques",
  "forearms",
  "biceps",
  "shoulders",
  "traps",
  "chest",
  "quads",
  "calves",
] as const;

export const BACK_MUSCLE_TARGET = [
  "hamstrings",
  "lowerback",
  "glutes",
  "lats",
  "traps-middle",
  "traps",
  "rear-shoulders",
  "calves",
  "triceps",
  "forearms",
] as const;

export const MUSCLE_TARGET = [
  ...FRONT_MUSCLE_TARGET,
  ...BACK_MUSCLE_TARGET,
] as const;

export const BMR_STANDARD = {
  male: 88.362,
  female: 447.593,
};

export const BMR_RATE = [1.2, 1.375, 1.55, 1.725, 1.9];

export const workoutFrequencyOptions: SelectOption[] = [
  { label: "Little to no exercise", value: "1.2" },
  { label: "Light exercise (1-3 days per week)", value: "1.375" },
  { label: "Moderate exercise (3-5 days per week)", value: "1.55" },
  { label: "Heavy exercise (6-7 days per week)", value: "1.725" },
  {
    label: "Very heavy exercise (twice per day, extra heavy workouts)",
    value: "1.9",
  },
];

export const workoutTargetOptions: SelectOption[] = [
  { label: "Loose 1kg per week", value: "-500" },
  { label: "Loose 0.5 per week", value: "-250" },
  { label: "Stay the same weight", value: "0" },
  { label: "Gain 0.5 per week", value: "250" },
  { label: "Gain 1kg per week", value: "500" },
];
