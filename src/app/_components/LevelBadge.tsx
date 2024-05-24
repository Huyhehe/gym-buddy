import { Badge } from "@mantine/core";

type Props = {
  level: string;
};

const getBadgeColor = (level: string) => {
  switch (level) {
    case "beginner":
      return "green";
    case "intermediate":
      return "orange";
    case "advanced":
      return "pink";
  }
};

export const LevelBadge = ({ level }: Props) => {
  return (
    <Badge color={getBadgeColor(level)} className="shrink-0 capitalize">
      {level}
    </Badge>
  );
};
