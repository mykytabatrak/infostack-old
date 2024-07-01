import type { LoaderFunctionArgs } from "react-router-dom";

import { Grid } from "@radix-ui/themes";
import { Outlet, redirect } from "react-router-dom";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (url.pathname === "/auth") {
    return redirect("/auth/sign-in");
  }

  return null;
}

export default function Auth() {
  return (
    <Grid
      minHeight="100dvh"
      columns="minmax(0, 460px)"
      align="center"
      justify="center"
      p="2"
    >
      <Outlet />
    </Grid>
  );
}
