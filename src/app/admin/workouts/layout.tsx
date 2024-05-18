import { MyBreadcrumbs } from "@/app/_components/MyBreadcrumbs";
import type { PropsWithChildren } from "react";

const WorkoutsPageLayout = ({ children }: PropsWithChildren<object>) => {
  return (
    <div>
      <MyBreadcrumbs />

      <div>{children}</div>
    </div>
  );
};

export default WorkoutsPageLayout;
