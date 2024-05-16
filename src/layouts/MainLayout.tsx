import { Sidebar } from "@/app/_components/Sidebar";
import { Topbar } from "@/app/_components/Topbar";
import { getServerAuthSession } from "@/server/auth";
import type { PropsWithChildren } from "react";

export default async function MainLayout({
  children,
}: PropsWithChildren<object>) {
  const session = await getServerAuthSession();

  return (
    <div className="flex min-h-svh">
      <div className="relative min-h-svh bg-primary">
        <Sidebar session={session} />
      </div>
      <div className="grow">
        <Topbar session={session} />
        <div>{children}</div>
      </div>
    </div>
  );
}
