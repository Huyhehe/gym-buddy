import { Sidebar } from "@/app/_components/Sidebar";
import { Topbar } from "@/app/_components/Topbar";
import { getServerAuthSession } from "@/server/auth";
import type { PropsWithChildren } from "react";

// const letTailwindKnow = [
//   "bg-green-500",
//   "bg-yellow-200",
//   "bg-orange-400",
//   "bg-red-600",
//   "bg-neutral-200",
//   "text-green-500",
//   "text-yellow-200",
//   "text-orange-400",
//   "text-red-600",
//   "text-neutral-200",
// ];

export default async function MainLayout({
  children,
}: PropsWithChildren<object>) {
  const session = await getServerAuthSession();

  return (
    <div className="flex min-h-svh">
      <div className="relative min-h-svh bg-primary">
        <Sidebar session={session} />
      </div>
      <div className="grow bg-[#e7ecef]">
        <Topbar session={session} />
        <div>{children}</div>
      </div>
    </div>
  );
}
