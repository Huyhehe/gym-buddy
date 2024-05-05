import { Sidebar } from "@/app/_components/Sidebar";
import { getServerAuthSession } from "@/server/auth";
import type { PropsWithChildren } from "react";

export default async function MainLayout({
  children,
}: PropsWithChildren<object>) {
  const session = await getServerAuthSession();

  return (
    <div className="flex min-h-svh">
      <Sidebar session={session} />
      <div>{children}</div>
    </div>
  );
}
