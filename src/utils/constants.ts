import { HomeIcon } from "@/assets/icons/HomeIcon";
import { RoutinesIcon } from "@/assets/icons/RoutinesIcon";
import { ToolsIcon } from "@/assets/icons/ToolsIcon";
import { WorkoutIcon } from "@/assets/icons/WorkoutIcon";
import type { SelectOption, SidebarLinks } from "@/types";

export const sidebarLinks: SidebarLinks[] = [
  {
    title: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    title: "Workouts",
    href: "/workouts",
    icon: WorkoutIcon,
    subLinks: [
      {
        title: "Workouts",
        href: "",
      },
      {
        title: "My Workouts",
        href: "/my-workouts",
      },
      {
        title: "Workout Builder",
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
    title: "Admin",
    href: "/admin",
    adminOnly: true,
    subLinks: [
      {
        title: "Users",
        href: "/users",
      },
      {
        title: "Exercises",
        href: "/exercises",
      },
      {
        title: "Workouts",
        href: "/workouts",
      },
      {
        title: "Routines",
        href: "/routines",
      },
    ],
  },
];

export const difficultyOptions: SelectOption[] = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

export const mechanicOptions: SelectOption[] = [
  { label: "Compound", value: "compound" },
  { label: "Isolation", value: "isolation" },
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
