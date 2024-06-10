"use client";

import { cn } from "@/utils";
import { type PropsWithChildren, type ReactNode } from "react";

type ClassNames = {
  title: string;
  main: string;
};

type Props = {
  title?: ReactNode;
  classNames?: Partial<ClassNames>;
};

export const FormPartWrapper = ({
  children,
  title,
  classNames,
}: PropsWithChildren<Props>) => {
  return (
    <>
      <h1
        className={cn(
          "mb-4 text-3xl font-bold uppercase text-primary",
          classNames?.title,
        )}
      >
        {title}
      </h1>
      <div className={cn("@4xl/generate-workout:px-[20%]", classNames?.main)}>
        {children}
      </div>
    </>
  );
};
