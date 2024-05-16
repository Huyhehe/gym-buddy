import { MyBreadcrumbs } from "@/app/_components/MyBreadcrumbs";
import type { PropsWithChildren } from "react";

const ExercisePageLayout = ({ children }: PropsWithChildren<object>) => {
  return (
    <div>
      <MyBreadcrumbs />

      <div>{children}</div>
    </div>
  );
};

export default ExercisePageLayout;
