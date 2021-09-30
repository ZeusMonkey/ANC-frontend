import { ApeTextField } from "components";
import React from "react";

export const FormTextField = ({
  error,
  errorText,
  helperText,
  onChange,
  value,
  ...props
}: Omit<React.ComponentProps<typeof ApeTextField>, "onChange"> & {
  onChange: (newValue: any) => void;
  errorText?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(
      typeof value === "number" ? Number(e.target.value) : e.target.value
    );
  };

  return (
    <ApeTextField
      {...props}
      error={error}
      helperText={!errorText ? helperText : errorText}
      onChange={handleChange}
      value={value}
    />
  );
};
