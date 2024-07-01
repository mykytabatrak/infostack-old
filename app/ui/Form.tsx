import type { FlexProps } from "@radix-ui/themes";

import * as RUIForm from "@radix-ui/react-form";
import { Flex, Text } from "@radix-ui/themes";

export type FormRootProps = RUIForm.FormProps;
export type FormFieldProps = Omit<RUIForm.FormFieldProps, "asChild">;
export type FormFieldMetaProps = FlexProps;
export type FormLabelProps = RUIForm.FormLabelProps;
export type FormMessageProps = RUIForm.FormMessageProps;
export type FormControlProps = Omit<RUIForm.FormControlProps, "asChild">;
export type FormValidityStateProps = RUIForm.FormValidityStateProps;

const Root = RUIForm.Root;

function Field({ children, ...props }: Readonly<FormFieldProps>) {
  return (
    <RUIForm.Field asChild {...props}>
      <Flex direction="column" gap="2">
        {children}
      </Flex>
    </RUIForm.Field>
  );
}

function FieldMeta(props: Readonly<FormFieldMetaProps>) {
  return <Flex align="center" justify="between" gap="1" {...props} />;
}

function Label({ asChild, children, ...props }: Readonly<FormLabelProps>) {
  return (
    <RUIForm.Label asChild {...props}>
      <Text asChild={asChild} size="2" trim="both">
        {children}
      </Text>
    </RUIForm.Label>
  );
}

function Message({ asChild, children, ...props }: Readonly<FormMessageProps>) {
  return (
    <RUIForm.Message asChild {...props}>
      <Text asChild={asChild} size="1" align="right" color="red" trim="both">
        {children}
      </Text>
    </RUIForm.Message>
  );
}

function Control(props: Readonly<FormControlProps>) {
  return <RUIForm.Control asChild {...props} />;
}

function ValidityState(props: Readonly<FormValidityStateProps>) {
  return <RUIForm.ValidityState {...props} />;
}

export const Form = {
  Root,
  Field,
  FieldMeta,
  Label,
  Message,
  Control,
  ValidityState,
};
