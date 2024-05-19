import type { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren<object>) => {
  return <div className="p-4">{children}</div>;
};

export default layout;
