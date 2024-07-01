import type { LinkProps as RemixLinkProps } from "@remix-run/react";
import type { LinkProps as RadixLinkProps } from "@radix-ui/themes";

import { Link as RemixLink } from "@remix-run/react";
import { Link as RadixLink } from "@radix-ui/themes";

export interface LinkProps
  extends Omit<RemixLinkProps, "color">,
    RadixLinkProps {}

export function Link({ to, children, ...props }: Readonly<LinkProps>) {
  return (
    <RadixLink asChild {...props}>
      <RemixLink to={to}>{children}</RemixLink>
    </RadixLink>
  );
}
