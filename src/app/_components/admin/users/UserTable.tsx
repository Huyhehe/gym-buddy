"use client";

import { api } from "@/trpc/react";
import type { AdminGetAllUsersReturnType } from "@/types";
import { showNoti } from "@/utils";
import {
  Avatar,
  Button,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconEye,
  IconLockExclamation,
  IconLockOpen2,
} from "@tabler/icons-react";
import { isNil } from "lodash";
import { useState } from "react";

type TUserAction = {
  user: AdminGetAllUsersReturnType[number] | null;
  isBlocked: boolean;
};

export const UserTable = () => {
  const {
    data: users,
    isLoading,
    refetch: refetchUsers,
  } = api.admin.getAllUsers.useQuery();
  const [
    blockUserConfirm,
    { open: openBlockUserConfirm, close: closeBlockUserConfirm },
  ] = useDisclosure();
  const [userAction, setUserAction] = useState<TUserAction>();

  const { mutate: toggleBlockUser, isPending: isPendingToggleBlockUser } =
    api.admin.toggleBlockUser.useMutation({
      onSuccess: (_, variables) => {
        showNoti({
          message: `${variables.isBlocked ? "Khóa" : "Mở khóa"} người dùng thành công`,
        });
        void refetchUsers();
        closeBlockUserConfirm();
      },
      onError: () => {
        showNoti({
          status: "error",
          message: "Khóa người dùng không thành công",
        });
      },
    });

  const rows = users?.map((user) => {
    return (
      <Table.Tr key={user.id}>
        <Table.Td>
          <Avatar src={user.image} size={32} radius="xl" />
        </Table.Td>
        <Table.Td>{user.name}</Table.Td>
        <Table.Td>{user.age ?? "-"}</Table.Td>
        <Table.Td>{user.gender ?? "-"}</Table.Td>
        <Table.Td>{user.email}</Table.Td>
        <Table.Td>{user.isAdmin ? "Quản trị viên" : "Người dùng"}</Table.Td>
        <Table.Td>
          {!!user.sessions.length ? "Đang đăng nhập" : "Không đăng nhập"}
        </Table.Td>
        <Table.Td>
          <Group>
            <Tooltip label="Xem chi tiết người dùng">
              <IconEye className="box-content cursor-pointer rounded-full p-1 text-primary hover:bg-blue-700/20" />
            </Tooltip>
            {user.isBlocked ? (
              <Tooltip label="Mở khóa người dùng">
                <IconLockOpen2
                  className="box-content cursor-pointer rounded-full p-1 text-green-500 hover:bg-green-500/20"
                  onClick={() => {
                    setUserAction({ user, isBlocked: false });
                    openBlockUserConfirm();
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip label="Khóa người dùng khỏi hệ thống">
                <IconLockExclamation
                  className="box-content cursor-pointer rounded-full p-1 text-red-500 hover:bg-red-500/20"
                  onClick={() => {
                    setUserAction({ user, isBlocked: true });
                    openBlockUserConfirm();
                  }}
                />
              </Tooltip>
            )}
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });
  return (
    <>
      <div className="relative min-h-[400px] rounded-lg bg-white p-4">
        <LoadingOverlay visible={isLoading} zIndex={10} />
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Ảnh đại diện</Table.Th>
              <Table.Th>Tên</Table.Th>
              <Table.Th>Tuổi</Table.Th>
              <Table.Th>Giới tính</Table.Th>
              <Table.Th>Địa chỉ Email</Table.Th>
              <Table.Th>Vai trò</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th>Hành động</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <Modal
          opened={blockUserConfirm}
          onClose={() => !isPendingToggleBlockUser && closeBlockUserConfirm()}
          size="lg"
        >
          <Stack gap={0} align="center">
            <Avatar
              src={userAction?.user?.image ?? ""}
              size="xl"
              alt="User profile"
              className="rounded-full"
            />
            <Text fw="bold" fz="xl" ta="center">
              {userAction?.user?.name}
            </Text>
          </Stack>
          <Text className="text-xl" ta="center">
            Chọn <strong>Tiếp tục</strong> nếu bạn muốn{" "}
            {userAction?.isBlocked ? "khoá" : "mở khóa"} người dùng này
          </Text>
          <Group justify="flex-end" mt="md">
            <Button
              disabled={isPendingToggleBlockUser}
              radius="md"
              onClick={closeBlockUserConfirm}
            >
              Hủy bỏ
            </Button>
            <Button
              disabled={isPendingToggleBlockUser}
              radius="md"
              className="bg-red-700"
              onClick={() => {
                const userId = userAction?.user?.id;
                const isBlocked = userAction?.isBlocked;
                if (!userId || isNil(isBlocked)) return;

                toggleBlockUser({
                  userId,
                  isBlocked,
                });
              }}
            >
              Tiếp tục {isPendingToggleBlockUser && <Loader size={14} />}
            </Button>
          </Group>
        </Modal>
      </div>
    </>
  );
};
