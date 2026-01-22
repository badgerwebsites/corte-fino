import type { ReactNode, CSSProperties } from "react";

type ViewProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

export function View({ children, className, style, onClick }: ViewProps) {
  return <div className={className} style={style} onClick={onClick}>{children}</div>;
}
