import type { User } from "@supabase/supabase-js";
import type { LoaderFunctionArgs } from "react-router-dom";

import { useEffect } from "react";
import {
  Outlet,
  isRouteErrorResponse,
  json,
  redirect,
  useRouteError,
  useRouteLoaderData,
  useRevalidator,
} from "react-router-dom";
import { supabase } from "../services/supabase";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { Link } from "../ui/Link";

export const id = "root";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (url.pathname === "/") {
    return redirect("/workspaces");
  }

  const user = await supabase.auth.getUser();

  return json(user.data.user);
}

export function useLoaderData() {
  return useRouteLoaderData(id) as User | null;
}

export default function Root() {
  const revalidator = useRevalidator();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        revalidator.revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [revalidator]);

  return <Outlet />;
}

export function ErrorElement() {
  const error = useRouteError();

  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <Flex
        height="100dvh"
        direction="column"
        align="center"
        justify="center"
        gap="2"
      >
        <Text size="9">{error.status}</Text>
        <Heading m="0">{error.statusText}</Heading>
        {typeof error.data === "string" && <Text>{error.data}</Text>}
        <Link to="/">Return to home</Link>
      </Flex>
    );
  }

  return null;
}
