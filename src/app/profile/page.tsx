import { api } from "@/trpc/server";
import { ProfileHeader } from "../_components/profile/ProfileHeader";
import { ProfileInfoForm } from "../_components/profile/ProfileInfoForm";
import { CaloriesBurnedChart } from "../_components/profile/CaloriesBurnedChart";

const ProfilePage = async () => {
  const userInfo = await api.user.getUser();

  return (
    <div className="p-6">
      <div className="flex gap-4">
        <div className="grow space-y-4">
          <ProfileHeader
            avatar={userInfo.image ?? ""}
            name={userInfo.name ?? ""}
            email={userInfo.email ?? ""}
          />
          <ProfileInfoForm userInfo={userInfo} />
          <CaloriesBurnedChart />
        </div>
        <div className="basis-1/3">a</div>
      </div>
    </div>
  );
};

export default ProfilePage;
