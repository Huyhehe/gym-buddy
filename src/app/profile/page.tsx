import { api } from "@/trpc/server";
import {
  combineMuscleAffection,
  generateMuscleState,
  generateMuscleTargetForChart,
} from "@/utils";
import { Stack } from "@mantine/core";
import { ToggleBackMale } from "../_components/MuscleSkeleton/ToggleBackMale";
import { ToggleFrontMale } from "../_components/MuscleSkeleton/ToggleFrontMale";
import { CaloriesBurnedChart } from "../_components/profile/CaloriesBurnedChart";
import { MuscleFocusRadarChart } from "../_components/profile/MuscleFocusRadarChart";
import { ProfileHeader } from "../_components/profile/ProfileHeader";
import { ProfileInfoForm } from "../_components/profile/ProfileInfoForm";

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
        <Stack gap={0} className="h-fit w-1/3 rounded-xl bg-white p-4">
          <div className="grid grid-cols-2">
            <div className="col-span-1 flex">
              <ToggleFrontMale
                viewMode
                initialDataForViewMode={
                  generateMuscleState(
                    combineMuscleAffection(userInfo.muscleTargets),
                  ).front
                }
              />
            </div>
            <div className="col-span-1 flex">
              <ToggleBackMale
                viewMode
                initialDataForViewMode={
                  generateMuscleState(
                    combineMuscleAffection(userInfo.muscleTargets),
                  ).back
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <MuscleFocusRadarChart
              data={generateMuscleTargetForChart({
                muscleObject: generateMuscleState(
                  combineMuscleAffection(userInfo.muscleTargets, true),
                ).front,
                isFront: true,
              })}
            />
            <MuscleFocusRadarChart
              data={generateMuscleTargetForChart({
                muscleObject: generateMuscleState(
                  combineMuscleAffection(userInfo.muscleTargets, true),
                ).back,
              })}
            />
          </div>
        </Stack>
      </div>
    </div>
  );
};

export default ProfilePage;
