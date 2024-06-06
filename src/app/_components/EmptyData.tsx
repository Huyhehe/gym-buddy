"use client";

import { Stack } from "@mantine/core";
import { IconMoodEmpty } from "@tabler/icons-react";

type Props = {
  title?: string;
  message?: string;
};

export const EmptyData = ({
  title = "Xin lỗi vì sự bất tiện này :(",
  message = "Không tìm thấy dữ liệu phù hợp",
}: Props) => {
  return (
    <Stack gap={0} align="center">
      <IconMoodEmpty size={100} color="var(--color-primary)" />
      <h1 className="text-center text-xl font-bold">{title}</h1>
      <p className="text-center font-semibold">{message}</p>
    </Stack>
  );
};
