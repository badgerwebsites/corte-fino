import type { ReactNode, CSSProperties } from "react";

type ViewProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function View({ children, className, style }: ViewProps) {
  return <div className={className} style={style}>{children}</div>;
}
