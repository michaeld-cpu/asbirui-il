import * as React from "react";
import { cn } from "../../lib/cn";

/*
  FormField — wraps a control with a label, description, and error message,
  wiring up ids and ARIA for you.

    <FormField label="Email" description="We'll never share it." error={err}>
      <Input type="email" />
    </FormField>

  The single child is cloned with a generated `id`, `aria-describedby` (pointing
  at whichever of description/error is present), and `aria-invalid` when there's
  an error. Pass a function child instead to wire it up yourself:

    <FormField label="Bio">
      {({ id, describedById, invalid }) => (
        <Textarea id={id} aria-describedby={describedById} invalid={invalid} />
      )}
    </FormField>

  `Label` is also exported as a standalone styled <label>.
*/

let seq = 0;

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return <label className={cn("text-sm font-medium text-fg", className)} {...props} />;
}

export interface FormFieldRenderProps {
  id: string;
  describedById: string | undefined;
  invalid: boolean;
}

export interface FormFieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Error message; when present the control is marked invalid. */
  error?: React.ReactNode;
  /** Force the invalid styling/ARIA without an error message. */
  invalid?: boolean;
  /** Mark the field required (adds a subtle asterisk to the label). */
  required?: boolean;
  className?: string;
  children: React.ReactElement | ((props: FormFieldRenderProps) => React.ReactNode);
}

export function FormField({
  label,
  description,
  error,
  invalid,
  required = false,
  className,
  children,
}: FormFieldProps) {
  const uid = React.useRef<number>();
  if (!uid.current) uid.current = ++seq;
  const base = `asbir-field-${uid.current}`;

  const controlId = `${base}-control`;
  const descId = description ? `${base}-desc` : undefined;
  const errorId = error ? `${base}-error` : undefined;
  const isInvalid = invalid ?? Boolean(error);
  const describedById = [descId, errorId].filter(Boolean).join(" ") || undefined;

  const renderProps: FormFieldRenderProps = {
    id: controlId,
    describedById,
    invalid: isInvalid,
  };

  let control: React.ReactNode;
  if (typeof children === "function") {
    control = children(renderProps);
  } else if (React.isValidElement(children)) {
    control = React.cloneElement(children, {
      id: (children.props as { id?: string }).id ?? controlId,
      "aria-describedby":
        [(children.props as { ["aria-describedby"]?: string })["aria-describedby"], describedById]
          .filter(Boolean)
          .join(" ") || undefined,
      "aria-invalid": isInvalid || undefined,
      invalid: isInvalid || undefined,
    } as Record<string, unknown>);
  } else {
    control = children;
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label != null && (
        <Label htmlFor={controlId}>
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-red-500">
              *
            </span>
          )}
        </Label>
      )}
      {control}
      {description != null && !error && (
        <p id={descId} className="text-xs text-fg/55">
          {description}
        </p>
      )}
      {error != null && (
        <p id={errorId} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
