"use client";
import { cn, generateColorByAffectLevel } from "@/utils";
import { Box } from "@mantine/core";

const levels = [
  { level: 3, text: "Chính" },
  { level: 2, text: "Phụ" },
  { level: 1, text: "Hỗ trợ" },
];

export const MuscleAffectLevelContainer = () => {
  return (
    <Box display="grid" py={16} className="grid-cols-12 gap-2">
      {levels.map((level) => (
        <div
          key={level.level}
          className="col-span-4 flex flex-nowrap items-center gap-2 rounded-md border px-2"
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
