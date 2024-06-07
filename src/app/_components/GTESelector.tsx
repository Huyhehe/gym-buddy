"use client";

import { gteOptions } from "@/utils";
import { Select } from "@mantine/core";

type Props = {
  onReturnValue: (values: number) => void;
};

export const GTESelector = ({ onReturnValue }: Props) => {
  return (
    <Select
      radius="md"
      data={gteOptions}
      defaultValue={gteOptions[0]?.value}
      onChange={(e) => {
        !!e && onReturnValue(Number(e));
      }}
    />
  );
};
