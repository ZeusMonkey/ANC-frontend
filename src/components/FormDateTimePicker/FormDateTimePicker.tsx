import { DateType } from "@date-io/type";
import { DateTimePicker } from "@material-ui/pickers";
import { ApeTextField } from "components";
import React from "react";

export const FormDateTimePicker = ({
  error,
  errorText,
  onChange,
  ...props
}: Omit<React.ComponentProps<typeof DateTimePicker>, "onChange"> & {
  onChange: (newValue: Date | null) => void;
  errorText?: string;
}) => {
  const handleChange = (date: DateType | null) => {
    onChange(date?.toJSDate() ?? null);
  };

  return (
    <DateTimePicker
      onChange={handleChange}
      {...props}
      TextFieldComponent={ApeTextField}
      error={error}
      helperText={errorText}
    />
  );
};
