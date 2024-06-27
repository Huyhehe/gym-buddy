"use client";

import { getMuscleName } from "@/utils";
import { RadarChart } from "@mantine/charts";
import { useMemo } from "react";

type Props = {
  data: {
    muscle: string;
    value: number;
  }[];
};

export const MuscleFocusRadarChart = ({ data }: Props) => {
  const dataReworked = useMemo(() => {
    return data.map((d) => ({
      ...d,
      muscle: getMuscleName(d.muscle),
    }));
  }, [data]);
  return (
    <RadarChart
      h={300}
      data={dataReworked}
      dataKey="muscle"
      withPolarRadiusAxis
      series={[{ name: "value", color: "blue.4", opacity: 0.2 }]}
    />
  );
};
