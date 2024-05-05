"use client";

import { ColorPicker, Text } from "@mantine/core";
import { useState } from "react";

export const Experimental = () => {
  const [value, onChange] = useState("rgba(47, 119, 150, 0.7)");

  return (
    <>
      <ColorPicker format="rgba" value={value} onChange={onChange} />
      <Text>{value}</Text>
    </>
  );
};
