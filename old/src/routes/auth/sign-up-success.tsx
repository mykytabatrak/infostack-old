import { Text } from "@radix-ui/themes";
import { AuthForm } from "../../features/auth/AuthForm";

export default function SignUpSuccess() {
  return (
    <AuthForm.Root>
      <AuthForm.Logo />
      <AuthForm.Separator />
      <AuthForm.Content>
        <AuthForm.Heading>Success!</AuthForm.Heading>
        <Text>You have successfully signed up!</Text>
        <Text>
          But before you proceed to sign in with your new account, please
          confirm your email by following the link in the message we sent to
          you.
        </Text>
      </AuthForm.Content>
    </AuthForm.Root>
  );
}
