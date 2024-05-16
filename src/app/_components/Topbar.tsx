import type { Session } from "next-auth";

interface Props {
  session?: Session | null;
}

export const Topbar = ({ session }: Props) => {
  return <div>Topbar</div>;
};
