import type { ActionFunctionArgs } from "react-router-dom";
import type { FlatErrors } from "valibot";

import { useFetcher } from "react-router-dom";
import { Form } from "../../ui/Form";
import { Link } from "../../ui/Link";
import { AuthForm } from "../../features/auth/AuthForm";
import { SignInSchema } from "../../features/auth/validation";

type ActionFunctionReturnType = FlatErrors<typeof SignInSchema> | null;

export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionFunctionReturnType | Response> {
  return null;
}

export default function SignIn() {
  const fetcher = useFetcher<ActionFunctionReturnType>();

  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const rootMessage =
    fetcher.data?.root?.[0] ?? hashParams.get("error_description");
  const emailMessage = fetcher.data?.nested?.email?.[0];
  const passwordMessage = fetcher.data?.nested?.password?.[0];

  return (
    <AuthForm.Root>
      <AuthForm.Logo />
      <AuthForm.Separator />
      <AuthForm.Content asChild>
        <Form.Root>
          <fetcher.Form method="post">
            <AuthForm.Heading>Sign in</AuthForm.Heading>
            {!!rootMessage && (
              <AuthForm.Message>{rootMessage}</AuthForm.Message>
            )}
            <AuthForm.EmailField />
            <AuthForm.PasswordField />
            <AuthForm.Submit />
          </fetcher.Form>
        </Form.Root>
      </AuthForm.Content>
      <AuthForm.Separator />
      <AuthForm.Footer>
        <Link to="/auth/reset-password">Reset password</Link>
        <Link to="/auth/sign-up">Sign up</Link>
      </AuthForm.Footer>
    </AuthForm.Root>
  );
}
