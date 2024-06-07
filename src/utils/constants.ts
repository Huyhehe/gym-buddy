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
  // {
  //   title: "Routines",
  //   href: "/routines",
  //   icon: RoutinesIcon,
  // },
  {
    title: "Công cụ",
    href: "/tools",
    icon: ToolsIcon,
    subLinks: [
      {
        title: "Máy tính Calorie",
        href: "/calorie-calculator",
      },
      {
        title: "Máy tính Macro",
        href: "/macro-calculator",
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
    ],
  },
];

export const LEVEL_LABEL = {
  novice: "Rất dễ",
  beginner: "Dễ",
  intermediate: "Trung bình",
  advanced: "Khó",
};

export const GENDER_LABEL = {
  male: "Nam",
  female: "Nữ",
};

export const GOAL_LABEL = {
  loseWeight: "Giảm cân",
  gainStrength: "Tăng sức mạnh",
  gainMuscle: "Tăng cơ bắp",
};

export const GTE_LABEL = {
  week: "7 ngày gần đây",
  month: "30 ngày gần đây",
  year: "365 ngày gần đây",
};

export const repsUnitOptions: SelectOption[] = [
  { label: "Số lần", value: "rep" },
  { label: "Số giây", value: "second" },
  { label: "Số phút", value: "minute" },
];
export const mechanicOptions: SelectOption[] = [
  { label: "Đa khớp", value: "compound" },
  { label: "Cô lập", value: "isolation" },
];

export const levelOptions: SelectOption[] = [
  { label: LEVEL_LABEL.novice, value: "1" },
  { label: LEVEL_LABEL.beginner, value: "2" },
  { label: LEVEL_LABEL.intermediate, value: "3" },
  { label: LEVEL_LABEL.advanced, value: "4" },
];

export const targetOptions: SelectOption[] = [
  {
    label: GOAL_LABEL.loseWeight,
    value: "lose-weight",
  },
  {
    label: GOAL_LABEL.gainStrength,
    value: "gain-strength",
  },
  {
    label: GOAL_LABEL.gainMuscle,
    value: "gain-muscle",
  },
];

export const gteOptions: SelectOption[] = [
  {
    label: GTE_LABEL.week,
    value: "7",
  },
  {
    label: GTE_LABEL.month,
    value: "30",
  },
  {
    label: GTE_LABEL.year,
    value: "365",
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
];

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
];

export const MUSCLE_TARGET = [
  "abdominals",
  "obliques",
  "biceps",
  "shoulders",
  "chest",
  "quads",
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

export const BMR_STANDARD = {
  male: 88.362,
  female: 447.593,
};

export const BMR_RATE = [1.2, 1.375, 1.55, 1.725, 1.9];

export const workoutFrequencyOptions: SelectOption[] = [
  { label: "Ít hoặc hầu như không tập thể dục", value: "1.2" },
  { label: "Tập ít (1-3 ngày trong tuần)", value: "1.375" },
  { label: "Tập thường xuyên (3-5 ngày trong tuần)", value: "1.55" },
  { label: "Tập mỗi ngày (6-7 ngày trong tuần)", value: "1.725" },
  {
    label: "Tôi là vận động viên (2 lần 1 ngày, tập với cường độ cao)",
    value: "1.9",
  },
];

export const workoutTargetOptions: SelectOption[] = [
  { label: "Giảm 1kg trong 1 tuần", value: "-500" },
  { label: "Giảm 0.5 trong 1 tuần", value: "-250" },
  { label: "Giữ nguyên cân nặng", value: "0" },
  { label: "Tăng 0.5 trong 1 tuần", value: "250" },
  { label: "Tăng 1kg trong 1 tuần", value: "500" },
];
