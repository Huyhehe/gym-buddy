"use client";

import { Button, Divider, Modal, Stack, TextInput } from "@mantine/core";

import { GoogleIcon } from "@/assets/icons/GoogleIcon";
import { IconKey, IconMail } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const LoginModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={<h3 className="text-2xl font-bold">Đăng nhập</h3>}
      radius="md"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack>
        <TextInput
          radius="md"
          size="lg"
          placeholder="Email"
          leftSection={<IconMail className="text-gray-200" />}
        />
        <TextInput
          radius="md"
          size="lg"
          placeholder="Mật khẩu"
          leftSection={<IconKey className="text-gray-200" />}
          type="password"
        />
        <Button fullWidth size="lg" color="var(--color-primary)">
          Đăng nhập
        </Button>
      </Stack>

      <Divider my="xs" label="Hoặc" labelPosition="center" />

      <Button
        className="rounded-lg"
        variant="outline"
        color="var(--color-primary)"
        classNames={{
          label: "flex items-center justify-center gap-4",
        }}
        fullWidth
        size="lg"
        onClick={() => void signIn("google")}
      >
        <GoogleIcon />
        <span>Đăng nhập với Google</span>
      </Button>
    </Modal>
  );
};
