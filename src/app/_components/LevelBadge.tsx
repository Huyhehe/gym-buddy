import { generateLevelText } from "@/utils";
import { Badge } from "@mantine/core";

type Props = {
  level: number;
};

const getBadgeColor = (level: number) => {
  switch (level) {
    case 1:
      return "blue";
    case 2:
      return "green";
    case 3:
      return "orange";
    case 4:
      return "pink";
  }
};

export const LevelBadge = ({ level }: Props) => {
  return (
    <Badge color={getBadgeColor(level)} className="shrink-0 capitalize">
      {generateLevelText(level)}
    </Badge>
  );
};
