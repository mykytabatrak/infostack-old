import * as RUIAccordion from "@radix-ui/react-accordion";
import { cx } from "cva";
import { ChevronDownIcon } from "@radix-ui/themes";

export type AccordionRootProps =
  | RUIAccordion.AccordionSingleProps
  | RUIAccordion.AccordionMultipleProps;
export type AccordionItemProps = RUIAccordion.AccordionItemProps;
export interface AccordionHeaderProps
  extends Omit<RUIAccordion.AccordionHeaderProps, "asChild"> {
  heading: "h2" | "h3";
}
export type AccordionContentProps = RUIAccordion.AccordionContentProps;

function Root({ className, ...props }: Readonly<AccordionRootProps>) {
  return (
    <RUIAccordion.Root
      className={cx("rounded-3 bg-accent-a1", className)}
      {...props}
    />
  );
}

function Item({ className, ...props }: Readonly<AccordionItemProps>) {
  return (
    <RUIAccordion.Item
      className={cx(
        "mt-px overflow-hidden",
        "first:mt-0 first:rounded-t-3 last:rounded-b-3",
        "outline-2 outline-accent-8 has-[:focus-visible]:outline",
        className
      )}
      {...props}
    />
  );
}

function Header({
  className,
  children,
  heading: Heading,
  ...props
}: Readonly<AccordionHeaderProps>) {
  return (
    <RUIAccordion.Header className={cx("flex", className)} asChild {...props}>
      <Heading>
        <RUIAccordion.Trigger
          className={cx(
            "group",
            "flex h-6 flex-1 items-center justify-between bg-accent-a3 px-3 text-accent-12",
            "hover:bg-accent-a4 active:bg-accent-a5",
            className
          )}
        >
          {children}
          <ChevronDownIcon
            className="transition-transform duration-300 group-data-open:rotate-180"
            aria-hidden="true"
          />
        </RUIAccordion.Trigger>
      </Heading>
    </RUIAccordion.Header>
  );
}

export function Content({
  className,
  children,
  ...props
}: Readonly<AccordionContentProps>) {
  return (
    <RUIAccordion.Content
      className={cx(
        "overflow-hidden bg-accent-a2 text-2 text-accent-12",
        "data-closed:animate-accordion-slide-up data-open:animate-accordion-slide-down",
        className
      )}
      {...props}
    >
      <div className="p-3">{children}</div>
    </RUIAccordion.Content>
  );
}

export const Accordion = {
  Root,
  Item,
  Header,
  Content,
};
