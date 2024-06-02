"use client";

import { type TProfileFormSchema } from "@/app/profile/_schemas";
import type { UserReturnType } from "@/types";
import { NumberInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  userInfo: NonNullable<UserReturnType>;
};

export const ProfileInfoForm = ({ userInfo }: Props) => {
  const form = useForm<TProfileFormSchema>({
    initialValues: {
      age: userInfo.age ?? 0,
      caloriesNeed: userInfo.caloriesNeed ?? 1200,
      height: userInfo.height ?? 0,
      weight: userInfo.weight ?? 0,
    },
  });
  return (
    <div className="rounded-xl bg-white p-8">
      <h1 className="mb-8 text-2xl font-bold">Hồ sơ thông tin</h1>
      <form>
        <div className="grid grid-cols-12 gap-4 gap-y-8">
          <NumberInput
            label={
              <Text size="md" fw="bold">
                Tuổi
              </Text>
            }
            className="col-span-6"
            radius="md"
            size="md"
            rightSectionWidth={60}
            rightSection="years"
            rightSectionPointerEvents="none"
            key={form.key("age")}
            {...form.getInputProps("age")}
          />
          <NumberInput
            label={
              <Text size="md" fw="bold">
                Calories cần thiết
              </Text>
            }
            className="col-span-6"
            radius="md"
            size="md"
            rightSectionWidth={50}
            rightSection="kcal"
            rightSectionPointerEvents="none"
            key={form.key("caloriesNeed")}
            {...form.getInputProps("caloriesNeed")}
          />
          <NumberInput
            label={
              <Text size="md" fw="bold">
                Cân nặng
              </Text>
            }
            className="col-span-6"
            radius="md"
            size="md"
            rightSectionWidth={55}
            rightSection="kg(s)"
            rightSectionPointerEvents="none"
            key={form.key("weight")}
            {...form.getInputProps("weight")}
          />
          <NumberInput
            label={
              <Text size="md" fw="bold">
                Chiều cao
              </Text>
            }
            className="col-span-6"
            radius="md"
            size="md"
            rightSectionWidth={60}
            rightSection="cm(s)"
            rightSectionPointerEvents="none"
            key={form.key("height")}
            {...form.getInputProps("height")}
          />
        </div>
      </form>
    </div>
  );
};
