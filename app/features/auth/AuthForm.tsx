import type {
  FlexProps,
  HeadingProps as RUIHeadingProps,
  CardProps,
  SeparatorProps as RUISeparatorProps,
} from "@radix-ui/themes";

import { useState } from "react";
import { cx } from "cva";
import {
  Heading as RUIHeading,
  Text,
  Flex,
  Separator as RUISeparator,
  Card,
  TextField,
  Button,
  IconButton,
  AccessibleIcon,
  Callout,
} from "@radix-ui/themes";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { Form } from "../../ui/Form";
import { Logo as AppLogo } from "../../ui/Logo";
import { Accordion } from "../../ui/Accordion";
import { messages } from "./messages";
import {
  passwordAllowedSymbolsRegExp,
  passwordMaxLengthRegExp,
  passwordMinLengthRegExp,
  passwordOneDigitRegExp,
  passwordOneLowercaseRegExp,
  passwordOneSpecialSymbolRegExp,
  passwordOneUppercaseRegExp,
  passwordPattern,
} from "./validation";

export namespace AuthForm {
  export type RootProps = CardProps;
  export type SeparatorProps = RUISeparatorProps;
  export type ContentProps = FlexProps;
  export type HeadingProps = RUIHeadingProps;
  export type MessageProps = Callout.TextProps;
}

function Root({ className, ...props }: Readonly<AuthForm.RootProps>) {
  return (
    <Card
      size="2"
      className={cx("flex flex-col gap-5", className)}
      {...props}
    />
  );
}

function Separator(props: Readonly<AuthForm.SeparatorProps>) {
  return <RUISeparator size="4" {...props} />;
}

function Logo() {
  return (
    <Flex mx="auto" gap="2" align="center" justify="center">
      <AppLogo className="h-6 w-6" />
      <Text size="6" weight="bold" trim="both">
        Infostack
      </Text>
    </Flex>
  );
}

function Content(props: Readonly<AuthForm.ContentProps>) {
  return <Flex direction="column" gap="4" {...props} />;
}

function Heading(props: Readonly<AuthForm.HeadingProps>) {
  return <RUIHeading m="0" {...props} />;
}

function Message(props: Readonly<AuthForm.MessageProps>) {
  return (
    <Callout.Root color="red" role="alert">
      <Callout.Icon>
        <ExclamationTriangleIcon />
      </Callout.Icon>
      <Callout.Text {...props} />
    </Callout.Root>
  );
}

type EmailFieldProps = Readonly<{ message?: string }>;

function EmailField({ message }: EmailFieldProps) {
  return (
    <Form.Field name="email">
      <Form.FieldMeta>
        <Form.Label>Email</Form.Label>
        {message ? (
          <Form.Message>{message}</Form.Message>
        ) : (
          <>
            <Form.Message match="valueMissing">
              {messages.email.valueMissing}
            </Form.Message>
            <Form.Message match="typeMismatch">
              {messages.email.typeMismatch}
            </Form.Message>
          </>
        )}
      </Form.FieldMeta>
      <Form.Control>
        <TextField.Root
          type="email"
          required
          placeholder="Enter your email"
          size="3"
        />
      </Form.Control>
    </Form.Field>
  );
}

function PasswordField() {
  return (
    <Form.Field name="password">
      <Form.FieldMeta>
        <Form.Label>Password</Form.Label>
        <Form.Message match="valueMissing">Password is required</Form.Message>
      </Form.FieldMeta>
      <Form.Control>
        <TextField.Root
          type="password"
          required
          placeholder="Enter your password"
          size="3"
        />
      </Form.Control>
    </Form.Field>
  );
}

type CreatePsswordFieldProps = Readonly<{ message?: string }>;

function CreatePasswordField({ message }: CreatePsswordFieldProps) {
  const [value, setValue] = useState("");
  const [isShown, setIsShown] = useState(false);

  return (
    <Form.Field name="password">
      <Form.FieldMeta>
        <Form.Label>Password</Form.Label>
        {message ? (
          <Form.Message>{message}</Form.Message>
        ) : (
          <>
            <Form.Message match="valueMissing">
              {messages.password.valueMissing}
            </Form.Message>
            <Form.Message match="patternMismatch">
              {messages.password.patternMismatch}
            </Form.Message>
          </>
        )}
      </Form.FieldMeta>
      <Form.Control>
        <TextField.Root
          value={value}
          onChange={(event) => setValue(event.target.value)}
          type={isShown ? "text" : "password"}
          required
          placeholder="Enter your password"
          size="3"
          pattern={passwordPattern}
        >
          <TextField.Slot
            side="right"
            onClick={() => setIsShown((prev) => !prev)}
          >
            <IconButton type="button" variant="ghost">
              {isShown ? (
                <AccessibleIcon label="Hide password">
                  <EyeClosedIcon />
                </AccessibleIcon>
              ) : (
                <AccessibleIcon label="Show password">
                  <EyeOpenIcon />
                </AccessibleIcon>
              )}
            </IconButton>
          </TextField.Slot>
        </TextField.Root>
      </Form.Control>
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="password-strength">
          <Accordion.Header heading="h2">
            Password requirements
          </Accordion.Header>
          <Accordion.Content>
            <ul>
              <RequirementPoint valid={passwordMinLengthRegExp.test(value)}>
                At least 8 characters
              </RequirementPoint>
              <RequirementPoint valid={passwordMaxLengthRegExp.test(value)}>
                No more than 40 characters
              </RequirementPoint>
              <RequirementPoint valid={passwordOneLowercaseRegExp.test(value)}>
                At least 1 lowercase letter
              </RequirementPoint>
              <RequirementPoint valid={passwordOneUppercaseRegExp.test(value)}>
                At least 1 uppercase letter
              </RequirementPoint>
              <RequirementPoint valid={passwordOneDigitRegExp.test(value)}>
                At least 1 digit
              </RequirementPoint>
              <RequirementPoint
                valid={passwordOneSpecialSymbolRegExp.test(value)}
              >
                At least 1 symbol
              </RequirementPoint>
              <RequirementPoint
                valid={passwordAllowedSymbolsRegExp.test(value)}
              >
                Only latin letters, numbers, and symbols
              </RequirementPoint>
            </ul>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </Form.Field>
  );
}

type RequirementPointProps = Readonly<{
  valid: boolean;
  children: React.ReactNode;
}>;

function RequirementPoint({ valid, children }: RequirementPointProps) {
  return (
    <li
      aria-live="polite"
      aria-atomic="true"
      className="flex items-start gap-2"
    >
      {valid ? (
        <Text as="span" color="green" className="flex h-lh items-center">
          <AccessibleIcon label="Password contains">
            <CheckCircledIcon />
          </AccessibleIcon>
        </Text>
      ) : (
        <Text as="span" color="red" className="flex h-lh items-center">
          <AccessibleIcon label="Password does not contain">
            <CrossCircledIcon />
          </AccessibleIcon>
        </Text>
      )}
      <span className="text-pretty">{children}</span>
    </li>
  );
}

type SubmitProps = Readonly<{ loading?: boolean }>;

function Submit({ loading }: SubmitProps) {
  return (
    <Flex align="center" justify="end">
      <Button type="submit" loading={loading}>
        Submit
      </Button>
    </Flex>
  );
}

type FooterProps = Readonly<{ children: React.ReactNode }>;

function Footer({ children }: FooterProps) {
  return (
    <Flex gap="2" align="center" justify="between" wrap="wrap">
      {children}
    </Flex>
  );
}

export const AuthForm = {
  Root,
  Separator,
  Logo,
  Content,
  Heading,
  Message,
  EmailField,
  PasswordField,
  CreatePasswordField,
  Submit,
  Footer,
};
