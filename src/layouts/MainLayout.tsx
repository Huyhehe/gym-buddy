import { Sidebar } from "@/app/_components/Sidebar";
import { Topbar } from "@/app/_components/Topbar";

import { getServerAuthSession } from "@/server/auth";

import type { PropsWithChildren } from "react";
import FunctionalLayout from "./FunctionalLayout";
import { GlobalContextProvider } from "@/app/workouts/workout-builder/_context/global-context";
import { api } from "@/trpc/server";

// const letTailwindKnow = [
//   "bg-blue-600",
//   "bg-green-500",
//   "bg-yellow-200",
//   "bg-orange-400",
//   "bg-red-600",
//   "bg-neutral-200",
//   "text-blue-600",
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

  let userInfo;

  if (session?.user) {
    try {
      userInfo = await api.user.getMe();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <GlobalContextProvider
      userInfo={{
        caloriesNeed: userInfo?.caloriesNeed,
        age: userInfo?.age,
        height: userInfo?.height,
        weight: userInfo?.weight,
      }}
    >
      <div className="relative flex min-h-svh">
        <div className="relative hidden min-h-svh bg-primary md:block">
          <Sidebar session={session} />
        </div>
        <div className="grow bg-[#e7ecef]">
          <Topbar session={session} />
          <FunctionalLayout>{children}</FunctionalLayout>
        </div>
      </div>
    </GlobalContextProvider>
  );
}
