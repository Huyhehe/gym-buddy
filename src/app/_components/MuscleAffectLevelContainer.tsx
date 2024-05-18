"use client";
import { cn, generateColorByAffectLevel } from "@/utils";
import { Box } from "@mantine/core";

const levels = [
  { level: 3, text: "Primary" },
  { level: 2, text: "Secondary" },
  { level: 1, text: "Tertiary" },
  { level: 0, text: "No effect" },
];

export const MuscleAffectLevelContainer = () => {
  return (
    <Box display="flex" py={16} className="gap-2">
      {levels.map((level) => (
        <div
          key={level.level}
          className="flex items-center gap-2 rounded-md border px-2"
        >
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              generateColorByAffectLevel(level.level, true),
            )}
          />
          <span className="text-sm">{level.text}</span>
        </div>
      ))}
    </Box>
  );
};
