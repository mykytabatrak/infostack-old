import type { ActionFunctionArgs } from "react-router-dom";
import type { FlatErrors } from "valibot";

import { redirect, useFetcher } from "react-router-dom";
import * as v from "valibot";
import { getURL } from "../../lib/getURL";
import { supabase } from "../../services/supabase";
import { AuthForm } from "../../features/auth/AuthForm";
import { SignUpSchema } from "../../features/auth/validation";
import { Form } from "../../ui/Form";
import { Link } from "../../ui/Link";

type ActionFunctionReturnType = FlatErrors<typeof SignUpSchema> | null;

export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionFunctionReturnType | Response> {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const result = v.safeParse(SignUpSchema, { email, password });
  if (!result.success) {
    return v.flatten(result.issues);
  }

  const authResponse = await supabase.auth.signUp({
    email: result.output.email,
    password: result.output.password,
    options: {
      emailRedirectTo: `${getURL()}auth/sign-in`,
    },
  });
  if (authResponse.error) {
    return {
      root: [authResponse.error.message],
    };
  }

  return redirect("/auth/sign-up-success");
}

export default function SignUp() {
  const fetcher = useFetcher<ActionFunctionReturnType>();

  const rootMessage = fetcher.data?.root?.[0];
  const emailMessage = fetcher.data?.nested?.email?.[0];
  const passwordMessage = fetcher.data?.nested?.password?.[0];

  return (
    <AuthForm.Root>
      <AuthForm.Logo />
      <AuthForm.Separator />
      <AuthForm.Content asChild>
        <Form.Root asChild>
          <fetcher.Form method="post">
            <AuthForm.Heading>Sign up</AuthForm.Heading>
            {!!rootMessage && (
              <AuthForm.Message>{rootMessage}</AuthForm.Message>
            )}
            <AuthForm.EmailField message={emailMessage} />
            <AuthForm.CreatePasswordField message={passwordMessage} />
            <AuthForm.Submit loading={fetcher.state === "submitting"} />
          </fetcher.Form>
        </Form.Root>
      </AuthForm.Content>
      <AuthForm.Separator />
      <AuthForm.Footer>
        <Link to="/auth/sign-in">Sign in</Link>
      </AuthForm.Footer>
    </AuthForm.Root>
  );
}
