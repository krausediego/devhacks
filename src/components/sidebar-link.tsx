import * as React from "react";
import { Link, type LinkProps, useLocation } from "react-router";

const SidebarLink = ({
  Icon,
  ...props
}: LinkProps & { Icon: React.ReactNode }) => {
  const { pathname } = useLocation();

  return (
    <Link
      {...props}
      data-active={pathname === props.to}
      className="text-muted-foreground data-[active=true]:bg-sidebar-border/40 hover:bg-sidebar-border/40 data-[active=true]:text-foreground flex items-center gap-2 rounded-md px-5 py-2 font-medium"
    >
      {Icon}
      <span className="truncate overflow-hidden whitespace-nowrap">
        {props.children}
      </span>
    </Link>
  );
};

export { SidebarLink };
