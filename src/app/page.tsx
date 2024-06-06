import { api } from "@/trpc/server";
import { HomePageCategoryContainer } from "./_components/home-page/HomePageCategoryContainer";
import { HomePageClientContextProvider } from "./_components/home-page/HomePageClientContextProvider";
import { HomePageNavigateSkeletons } from "./_components/home-page/HomePageNavigateSkeletons";

export default async function Home() {
  const equipments = await api.client.getEquipments();

  return (
    <main className="flex flex-col justify-center">
      <HomePageClientContextProvider equipments={equipments ?? []}>
        <div className="flex p-4 @container">
          <HomePageNavigateSkeletons />
          <HomePageCategoryContainer />
        </div>
      </HomePageClientContextProvider>
    </main>
  );
}
