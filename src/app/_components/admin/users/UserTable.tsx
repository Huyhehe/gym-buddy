"use client";

import { api } from "@/trpc/react";
import { Avatar, LoadingOverlay, Table } from "@mantine/core";

export const UserTable = () => {
  const { data: users, isLoading } = api.admin.getAllUsers.useQuery();

  const rows = users?.map((user) => {
    return (
      <Table.Tr key={user.id}>
        <Table.Td>
          <Avatar src={user.image} size={32} radius="xl" />
        </Table.Td>
        <Table.Td>{user.name}</Table.Td>
        <Table.Td>{user.email}</Table.Td>
        <Table.Td>{user.isAdmin ? "Quản trị viên" : "Người dùng"}</Table.Td>
        <Table.Td>
          {!!user.sessions.length ? "Đang đăng nhập" : "Không đăng nhập"}
        </Table.Td>
      </Table.Tr>
    );
  });
  return (
    <div className="relative min-h-[400px] rounded-lg bg-white p-4">
      <LoadingOverlay visible={isLoading} zIndex={10} />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Ảnh đại diện</Table.Th>
            <Table.Th>Tên</Table.Th>
            <Table.Th>Địa chỉ Email</Table.Th>
            <Table.Th>Vai trò</Table.Th>
            <Table.Th>Trạng thái</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};
