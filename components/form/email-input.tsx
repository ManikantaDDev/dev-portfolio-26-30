"use client";

import { TextInput, type TextInputProps } from "./text-input";

export type EmailInputProps = Omit<TextInputProps, "type"> & {
  autoComplete?: string;
};

export function EmailInput({ autoComplete = "email", ...props }: EmailInputProps) {
  return (
    <TextInput
      {...props}
      type="email"
      inputMode="email"
      autoComplete={autoComplete}
      required={props.required ?? true}
      placeholder={props.placeholder ?? "you@example.com"}
    />
  );
}
