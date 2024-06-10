"use client";

import { cn } from "@/utils";
import { HomePageBackMale } from "./HomePageBackMale";
import { HomePageFrontMale } from "./HomePageFrontMale";

type ClassNames = {
  root: string;
  front: string;
  back: string;
  skeleton: string;
};

type Props = {
  className?: string;
  classNames?: Partial<ClassNames>;
};

export const HomePageNavigateSkeletons = ({ className, classNames }: Props) => {
  return (
    <div className={cn(className, classNames?.root)}>
      <HomePageFrontMale
        className={cn(classNames?.skeleton, classNames?.front)}
      />
      <HomePageBackMale
        className={cn(classNames?.skeleton, classNames?.back)}
      />
    </div>
  );
};
