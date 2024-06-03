"use client";

import {
  profileFormSchema,
  type TProfileFormSchema,
} from "@/app/profile/_schemas";
import { api } from "@/trpc/react";
import type { UserReturnType } from "@/types";
import { Button, Group, NumberInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPencilMinus } from "@tabler/icons-react";
import { zodResolver } from "mantine-form-zod-resolver";

type Props = {
  burh: NonNullable<UserReturnType>;
};

export const ProfileInfoForm = ({ burh }: Props) => {
  const [isEditing, { open: onEdit, close: offEdit }] = useDisclosure();
  const { data: userInfo } = api.user.getUser.useQuery();

  const form = useForm<TProfileFormSchema>({
    initialValues: {
      age: userInfo?.age ?? 0,
      caloriesNeed: userInfo?.caloriesNeed ?? 1200,
      height: userInfo?.height ?? 0,
      weight: userInfo?.weight ?? 0,
    },
    validate: zodResolver(profileFormSchema),
  });

  const handleSubmit = (values: TProfileFormSchema) => {
    console.log({ values });
  };
  return (
    <div className="rounded-xl bg-white p-8">
      <Group className="mb-8" align="center" gap={4}>
        <h1 className="text-2xl font-bold">Hồ sơ thông tin</h1>
        {!isEditing && (
          <IconPencilMinus
            className="box-content cursor-pointer rounded-full p-1 text-primary transition-all duration-300 hover:bg-blue-700/20"
            onClick={onEdit}
          />
        )}
      </Group>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className="grid grid-cols-12 gap-4 gap-y-8">
          <NumberInput
            disabled={!isEditing}
            label={
              <Text size="md" fw="bold">
                Tuổi
              </Text>
            }
            className="col-span-6"
            radius="md"
            size="md"
            rightSectionWidth={50}
            rightSection="tuổi"
            rightSectionPointerEvents="none"
            key={form.key("age")}
            {...form.getInputProps("age")}
          />
          <NumberInput
            disabled={!isEditing}
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
            disabled={!isEditing}
            label={
              <Text size="md" fw="bold">
                Cân nặng
              </Text>
            }
            className="col-span-6"
            radius="md"
            size="md"
            rightSectionWidth={40}
            rightSection="kg"
            rightSectionPointerEvents="none"
            key={form.key("weight")}
            {...form.getInputProps("weight")}
          />
          <NumberInput
            disabled={!isEditing}
            label={
              <Text size="md" fw="bold">
                Chiều cao
              </Text>
            }
            className="col-span-6"
            radius="md"
            size="md"
            rightSectionWidth={45}
            rightSection="cm"
            rightSectionPointerEvents="none"
            key={form.key("height")}
            {...form.getInputProps("height")}
          />

          {isEditing && (
            <Group className="col-span-12 justify-end" gap={8}>
              <Button
                color="gray"
                onClick={() => {
                  offEdit();
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button color="var(--color-primary)" type="submit">
                Save
              </Button>
            </Group>
          )}
        </div>
      </form>
    </div>
  );
};
