"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";

export type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingChildren?: React.ReactNode;
};

export default function SubmitButton({
  children,
  pendingChildren,
  className,
  disabled,
  ...rest
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button
      type="submit"
      {...rest}
      className={className}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={pending}
    >
      {pending && pendingChildren !== undefined ? pendingChildren : children}
    </button>
  );
}

