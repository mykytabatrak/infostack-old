import { Form } from "../../ui/Form";
import { AuthForm } from "../../features/auth/AuthForm";
import { Link } from "../../ui/Link";

export function action() {
  console.log("update password");
  return null;
}

export default function UpdatePassword() {
  return (
    <AuthForm.Root>
      <AuthForm.Logo />
      <AuthForm.Separator />
      <AuthForm.Content asChild>
        <Form method="post">
          <AuthForm.Heading>Update password</AuthForm.Heading>
          <AuthForm.CreatePasswordField />
          <AuthForm.Submit />
        </Form>
      </AuthForm.Content>
      <AuthForm.Separator />
      <AuthForm.Footer>
        <Link to="/auth/sign-in">Sign in</Link>
      </AuthForm.Footer>
    </AuthForm.Root>
  );
}
