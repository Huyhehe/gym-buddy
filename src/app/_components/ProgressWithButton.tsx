"use client";

import { ActionIcon, Progress } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/utils";
import { isNil } from "lodash";
import { useState } from "react";

type ClassNames = {
  root: string;
  progress: string;
  leftIcon: string;
  rightIcon: string;
  icon: string;
};

type Props = {
  step?: number;
  outerProgress?: number;
  setOuterProgress?: (value: number) => void;
  className?: string;
  classNames?: Partial<ClassNames>;
};

type SetProgressParams = {
  increment?: boolean;
};

export const ProgressWithButton = ({
  step = 10,
  outerProgress,
  setOuterProgress,
  className,
  classNames,
}: Props) => {
  const [progress, setProgress] = useState(0);

  const handleSetProgress = (
    params: SetProgressParams = { increment: false },
  ) => {
    if (isNil(outerProgress)) {
      if (
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        (progress === 100 && params.increment) ||
        (progress === 0 && !params.increment)
      )
        return;

      setProgress((prev) =>
        params.increment ? (prev += step) : (prev -= step),
      );
      return;
    }

    if (
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      (outerProgress === 100 && params.increment) ||
      (outerProgress === 0 && !params.increment)
    )
      return;
    setOuterProgress?.(
      params.increment ? outerProgress + step : outerProgress - step,
    );
  };

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2",
        className,
        classNames?.root,
      )}
    >
      <ActionIcon
        className={cn(
          "box-content bg-primary px-2 py-1",
          classNames?.icon,
          classNames?.leftIcon,
        )}
        onClick={() => handleSetProgress()}
      >
        <IconChevronLeft />
      </ActionIcon>
      <Progress
        className={cn("w-[1200px]", classNames?.progress)}
        classNames={{
          section: "bg-primary rounded-full",
        }}
        value={isNil(outerProgress) ? progress : outerProgress}
      />
      <ActionIcon
        className={cn(
          "box-content bg-primary px-2 py-1",
          classNames?.icon,
          classNames?.rightIcon,
        )}
        onClick={() => handleSetProgress({ increment: true })}
      >
        <IconChevronRight />
      </ActionIcon>
    </div>
  );
};
