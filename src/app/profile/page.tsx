import { api } from "@/trpc/server";
import {
  combineMuscleAffection,
  generateMuscleState,
  generateMuscleTargetForChart,
} from "@/utils";
import { Button, Group, Stack } from "@mantine/core";
import { EmptyData } from "../_components/EmptyData";
import { ToggleSkeleton } from "../_components/MuscleSkeleton/ToggleSkeleton";
import { CaloriesBurnedChart } from "../_components/profile/CaloriesBurnedChart";
import { MuscleFocusRadarChart } from "../_components/profile/MuscleFocusRadarChart";
import { ProfileHeader } from "../_components/profile/ProfileHeader";
import { ProfileInfoForm } from "../_components/profile/ProfileInfoForm";

const ProfilePage = async () => {
  try {
    const userInfo = await api.user.getMe();
    return (
      <div className="p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 space-y-4">
            <ProfileHeader
              avatar={userInfo.image ?? ""}
              name={userInfo.name ?? ""}
              email={userInfo.email ?? ""}
            />
            <ProfileInfoForm userInfo={userInfo} />
            <CaloriesBurnedChart gte={30} />
          </div>
          <Stack gap={0} className="h-fit w-1/3 rounded-xl bg-white p-4">
            <span className="mb-2 text-sm font-semibold text-gray-500">
              Các nhóm cơ bạn đã tập trong 30 ngày gần nhất
            </span>
            <ToggleSkeleton
              viewMode
              className="flex w-full justify-center py-4"
              initialDataForViewMode={generateMuscleState(
                combineMuscleAffection(userInfo.muscleTargets),
              )}
              // female={userInfo.gender}
            />
            <div className="grid grid-cols-2">
              <MuscleFocusRadarChart
                data={generateMuscleTargetForChart({
                  muscleObject: generateMuscleState(
                    combineMuscleAffection(userInfo.muscleTargets, true),
                  ),
                  isFront: true,
                })}
              />
              <MuscleFocusRadarChart
                data={generateMuscleTargetForChart({
                  muscleObject: generateMuscleState(
                    combineMuscleAffection(userInfo.muscleTargets, true),
                  ),
                })}
              />
            </div>
            <Button
              color="var(--color-primary)"
              radius="md"
              component="a"
              href="/profile/history"
            >
              Xem lịch sử
            </Button>
          </Stack>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <Group justify="center">
        {" "}
        <EmptyData title={(error as Error).message} message=" " />
      </Group>
    );
  }
};

export default ProfilePage;
