import type {
  LinksFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  json,
  useRouteLoaderData,
} from "@remix-run/react";
import {
  getSignInUrl,
  signOut,
  authkitLoader,
} from "@workos-inc/authkit-remix";
import {
  Flex,
  Text,
  Heading,
  Code,
  Container,
  Box,
  Card,
  Button,
} from "@radix-ui/themes";
import { Link } from "~/ui/Link";
import Footer from "~/ui/Footer";
import { SignInButton } from "~/features/auth/SignInButton";

import rootStylesHref from "./global.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: rootStylesHref },
];

export function loader(args: LoaderFunctionArgs) {
  return authkitLoader(
    args,
    async () => {
      return json({
        signInUrl: await getSignInUrl(),
      });
    },
    { debug: true }
  );
}

export function useRootLoaderData() {
  return useRouteLoaderData<typeof loader>("root");
}

export async function action({ request }: ActionFunctionArgs) {
  return await signOut(request);
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Container style={{ backgroundColor: "var(--gray-1)" }}>
      <Flex direction="column" gap="5" p="5" height="100vh">
        <Box asChild flexGrow="1">
          <Card size="4">
            <Flex direction="column" height="100%">
              <Flex asChild justify="between">
                <header>
                  <Flex gap="4">
                    <Button asChild variant="soft">
                      <Link to="/">Home</Link>
                    </Button>

                    <Button asChild variant="soft">
                      <Link to="/account">Account</Link>
                    </Button>
                  </Flex>

                  <SignInButton />
                </header>
              </Flex>

              <Flex flexGrow="1" align="center" justify="center">
                <main>
                  <Outlet />
                </main>
              </Flex>
            </Flex>
          </Card>
        </Box>
        <Footer />
      </Flex>
    </Container>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let content;
  if (isRouteErrorResponse(error)) {
    content = (
      <>
        <Heading>{error.status}</Heading>
        <Text>{error.statusText}</Text>
        {typeof error.data === "string" && <Text>{error.data}</Text>}
        <Link to="/">Return home</Link>
      </>
    );
  } else if (error instanceof Error) {
    content = (
      <>
        <Heading>Error</Heading>
        <Text>{error.message}</Text>
        <Link to="/">Return home</Link>
        <Text>The stack trace is:</Text>
        <Code asChild>
          <pre>{error.stack}</pre>
        </Code>
      </>
    );
  } else {
    content = (
      <>
        <Heading>Unknown Error</Heading>
        <Link to="/">Return home</Link>
      </>
    );
  }

  return (
    <Flex height="100dvh" direction="column" align="center" justify="center">
      {content}
    </Flex>
  );
}
