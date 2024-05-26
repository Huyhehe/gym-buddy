import { generateLevelText } from "@/utils";
import { Badge } from "@mantine/core";

type Props = {
  level: number;
};

const getBadgeColor = (level: number) => {
  switch (level) {
    case 1:
      return "green";
    case 2:
      return "orange";
    case 3:
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
