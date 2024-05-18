import type { PropsWithChildren } from "react";

const UserViewWorkoutsLayout = ({ children }: PropsWithChildren<object>) => {
  return <div className="p-6">{children}</div>;
};

export default UserViewWorkoutsLayout;
