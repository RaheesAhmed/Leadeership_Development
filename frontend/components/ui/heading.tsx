import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Heading = ({ className, size = "md", ...props }: HeadingProps) => {
  return <h1 className={cn("font-bold", className)} {...props} />;
};
