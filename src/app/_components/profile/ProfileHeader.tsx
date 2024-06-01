"use client";

import { Avatar, Box, Stack } from "@mantine/core";

type Props = {
  avatar: string;
  name: string;
  email: string;
};

export const ProfileHeader = ({ avatar, name, email }: Props) => {
  return (
    <Stack className="overflow-hidden rounded-xl bg-white p-8">
      <Box className="h-36 w-full rounded-lg bg-primary" pos="relative">
        <Avatar
          src={avatar}
          size={144}
          pos="absolute"
          top="50%"
          left="50%"
          className="-translate-x-1/2"
        />
      </Box>
      <Stack
        className="mt-16 h-20 w-full"
        pos="relative"
        gap={0}
        align="center"
      >
        <h3 className="text-2xl font-bold">{name}</h3>
        <span className="text-gray-500">{email}</span>
      </Stack>
    </Stack>
  );
};
