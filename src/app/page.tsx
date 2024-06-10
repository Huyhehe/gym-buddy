import { api } from "@/trpc/server";
import { HomePageCategoryContainer } from "./_components/home-page/HomePageCategoryContainer";
import { HomePageClientContextProvider } from "./_components/home-page/HomePageClientContextProvider";
import { HomePageNavigateSkeletons } from "./_components/home-page/HomePageNavigateSkeletons";

export default async function Home() {
  const equipments = await api.client.getEquipments();

  return (
    <main className="flex flex-col justify-center ">
      <HomePageClientContextProvider equipments={equipments ?? []}>
        <div className="flex p-4 @container">
          <HomePageNavigateSkeletons
            className="hidden grow justify-center @4xl:flex"
            classNames={{
              skeleton: "@4xl:w-2/5",
            }}
          />
          <HomePageCategoryContainer className="h-fit @4xl:w-[40%] @6xl:w-[35%] @[1300px]:w-[30%]" />
        </div>
      </HomePageClientContextProvider>
    </main>
  );
}
