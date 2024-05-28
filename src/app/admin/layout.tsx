import { getServerAuthSession } from "@/server/auth";
import type { PropsWithChildren } from "react";

const AdminLayout = async ({ children }: PropsWithChildren<object>) => {
  const session = await getServerAuthSession();
  if (!session?.user.isAdmin) {
    return <div>You do not have permission to access this page!</div>;
  }

  return <div>{children}</div>;
};

export default AdminLayout;
