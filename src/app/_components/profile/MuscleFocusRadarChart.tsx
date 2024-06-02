"use client";

import { RadarChart } from "@mantine/charts";

type Props = {
  data: {
    muscle: string;
    value: number;
  }[];
};

export const MuscleFocusRadarChart = ({ data }: Props) => {
  return (
    <RadarChart
      h={300}
      data={data}
      dataKey="muscle"
      withPolarRadiusAxis
      series={[{ name: "value", color: "blue.4", opacity: 0.2 }]}
    />
  );
};
