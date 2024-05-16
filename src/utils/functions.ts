export const compareString = (a: string, b: string) => {
  return a === b;
};

export const generateColorByAffectLevel = (affectLevel: number) => {
  switch (affectLevel) {
    case 1:
      return "text-yellow-200";
    case 2:
      return "text-orange-400";
    case 3:
      return "text-red-600";
    default:
      return "text-neutral-200";
  }
};
