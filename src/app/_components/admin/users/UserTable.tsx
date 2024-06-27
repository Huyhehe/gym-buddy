"use client";

import { api } from "@/trpc/react";
import type { AdminGetAllUsersReturnType } from "@/types";
import {
  cn,
  getGenderLabel,
  showNoti,
  stringDeepIncludesCheck,
  workoutCreationHistoryDataPreWork,
} from "@/utils";
import { AreaChart } from "@mantine/charts";
import {
  Avatar,
  Button,
  Group,
  Highlight,
  Loader,
  LoadingOverlay,
  Modal,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowsHorizontal,
  IconArrowsVertical,
  IconCake,
  IconEye,
  IconGenderBigender,
  IconGenderFemale,
  IconGenderMale,
  IconLockExclamation,
  IconLockOpen2,
} from "@tabler/icons-react";
import { debounce, isNil } from "lodash";
import { useCallback, useEffect, useState } from "react";

type TUserAction = {
  user: AdminGetAllUsersReturnType[number] | null;
  isBlocked: boolean;
};

export const UserTable = () => {
  const [filteredUsers, setFilteredUsers] = useState<
    AdminGetAllUsersReturnType | null | undefined
  >();
  const [searchStr, setSearchStr] = useState<string>("");

  const {
    data: users,
    isLoading,
    refetch: refetchUsers,
  } = api.admin.getAllUsers.useQuery();

  const [
    blockUserConfirm,
    { open: openBlockUserConfirm, close: closeBlockUserConfirm },
  ] = useDisclosure();

  const [userInfoOpened, { open: openUserInfo, close: closeUserInfo }] =
    useDisclosure();

  const [userAction, setUserAction] = useState<TUserAction>();

  const { data: userStats } = api.admin.getUserStats.useQuery(
    {
      userID: userAction?.user?.id ?? "",
    },
    {
      enabled: !!userAction?.user?.id,
    },
  );

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

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const rows = filteredUsers?.map((user) => {
    return (
      <Table.Tr key={user.id}>
        <Table.Td>
          <Avatar src={user.image} size={32} radius="xl" />
        </Table.Td>
        <Table.Td>
          <Highlight highlight={searchStr} fz={14}>
            {user.name ?? "-"}
          </Highlight>
        </Table.Td>
        <Table.Td>{user.age ?? "-"}</Table.Td>
        <Table.Td>{user.gender ?? "-"}</Table.Td>
        <Table.Td>
          <Highlight highlight={searchStr} fz={14}>
            {user.email ?? "-"}
          </Highlight>
        </Table.Td>
        <Table.Td>{user.isAdmin ? "Quản trị viên" : "Người dùng"}</Table.Td>
        <Table.Td>
          {!!user.sessions.length ? "Đang đăng nhập" : "Không đăng nhập"}
        </Table.Td>
        <Table.Td>
          <Group>
            <Tooltip label="Xem chi tiết người dùng">
              <IconEye
                className="box-content cursor-pointer rounded-full p-1 text-primary hover:bg-blue-700/20"
                onClick={() => {
                  setUserAction(() => ({
                    isBlocked: user.isBlocked ?? false,
                    user,
                  }));
                  openUserInfo();
                }}
              />
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

  const handleSearch = useCallback(
    debounce(
      (searchStr: string | undefined, users: AdminGetAllUsersReturnType) => {
        setFilteredUsers(
          users?.filter((user) =>
            stringDeepIncludesCheck(
              (user.name ?? "") + user.email,
              searchStr ?? "",
            ),
          ),
        );
        setSearchStr(searchStr ?? "");
      },
      500,
    ),
    [],
  );

  !!userStats && console.log(workoutCreationHistoryDataPreWork(userStats));

  return (
    <>
      <TextInput
        placeholder="Tìm kiếm theo tên / email"
        className="mb-4 w-[300px]"
        radius="md"
        onChange={(e) => {
          const value = e.target.value;
          handleSearch(value, users ?? []);
        }}
      />
      <div className="relative min-h-[400px] rounded-lg bg-white p-4">
        <LoadingOverlay visible={isLoading} zIndex={10} />
        <Table striped>
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
          radius="md"
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
        <Modal
          opened={userInfoOpened}
          onClose={closeUserInfo}
          size={1000}
          radius="md"
        >
          <div className="grid grid-cols-12 gap-4">
            <Stack className="col-span-4 gap-16">
              <div className="relative h-24 w-full rounded-lg bg-primary">
                <Avatar
                  src={userAction?.user?.image ?? ""}
                  size={120}
                  pos="absolute"
                  top="100%"
                  left="50%"
                  className="-translate-x-1/2 -translate-y-1/2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Stack className="col-span-2" gap={0}>
                  <span className="text-center text-xl font-bold">
                    {userAction?.user?.name}
                  </span>
                  <span className="text-center text-gray-500">
                    {userAction?.user?.email}
                  </span>
                </Stack>
                <Group
                  align="end"
                  className="rounded-lg bg-green-200 p-4 font-bold text-green-500"
                  gap={8}
                >
                  <IconCake size={30} />
                  <span>{userAction?.user?.age ?? "-"} tuổi</span>
                </Group>
                <Group
                  align="end"
                  className={cn(
                    "rounded-lg bg-gray-200 p-4 font-bold text-gray-500",
                    {
                      "bg-blue-200 text-blue-500":
                        userAction?.user?.gender === true,
                    },
                  )}
                  gap={8}
                >
                  {isNil(userAction?.user?.gender) ? (
                    <IconGenderBigender />
                  ) : userAction.user.gender ? (
                    <IconGenderMale />
                  ) : (
                    <IconGenderFemale />
                  )}
                  <span>
                    {getGenderLabel(userAction?.user?.gender) ?? "Khác"}
                  </span>
                </Group>
                <Group
                  align="end"
                  className="rounded-lg bg-purple-200 p-4 font-bold text-purple-500"
                  gap={8}
                >
                  <IconArrowsVertical size={30} />
                  <span>{userAction?.user?.height ?? "-"} cm</span>
                </Group>
                <Group
                  align="end"
                  className="rounded-lg bg-orange-200 p-4 font-bold text-orange-500"
                  gap={8}
                >
                  <IconArrowsHorizontal size={30} />
                  <span>{userAction?.user?.weight ?? "-"} kg</span>
                </Group>
              </div>
            </Stack>
            <Stack className="col-span-8">
              <h3 className="text-2xl font-bold">Lịch sử hoạt động</h3>
              {!!userStats?.lastWorkoutRecord?.createdAt ? (
                <span>
                  Lần tập luyện gần đây nhất:{" "}
                  <strong>
                    {userStats?.lastWorkoutRecord?.createdAt.toLocaleString()}
                  </strong>
                </span>
              ) : (
                <strong>Chưa tập luyện lần nào!!</strong>
              )}
              <div className="relative h-[300px] rounded-xl bg-white p-4">
                <LoadingOverlay
                  visible={isLoading}
                  color="gray"
                  opacity={0.8}
                  zIndex={10}
                />
                {!!userStats && (
                  <AreaChart
                    className="h-full"
                    data={workoutCreationHistoryDataPreWork(userStats)}
                    dataKey="date"
                    withGradient
                    withLegend
                    type="stacked"
                    series={[
                      {
                        name: "system",
                        color: "blue.6",
                        label: "Hệ thống",
                      },
                      {
                        name: "self",
                        color: "orange.6",
                        label: "Tự tạo",
                      },
                    ]}
                  />
                )}
              </div>
            </Stack>
          </div>
        </Modal>
      </div>
    </>
  );
};
