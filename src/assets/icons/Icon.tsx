import { cn } from "@/utils";

interface Props {
  className?: string;
  html: string;
}

export function Icon({ className, html }: Props) {
  return (
    <div
      className={cn("h-8 w-8", className)}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
