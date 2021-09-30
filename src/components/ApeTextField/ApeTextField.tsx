import {
  InputBase,
  InputBaseProps,
  TextFieldProps,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import uniqueId from "lodash/uniqueId";
import React, { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  rootFullWidth: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    lineHeight: 1.3,
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    color: theme.colors.text,
  },
  inputRoot: {
    backgroundColor: theme.colors.third,
    borderRadius: 8,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.third}`,
    transition: "border 200ms ease-out",
    "&:focus-within": {
      border: `1px solid ${theme.colors.lightBlue}80`,
    },
  },
  inputRootError: {
    border: `1px solid ${theme.colors.red}`,
    color: "#ad0003",
    "&:focus-within": {
      border: `1px solid ${theme.colors.red}`,
    },
  },
  input: {
    padding: theme.spacing(1.75, 1, 1.75),
    fontSize: 15,
    lineHeight: 1.33,
    fontWeight: 300,
    textAlign: "center",
    "&::placeholder": {
      color: theme.colors.text + "80",
    },
  },
  helper: {
    fontSize: 13,
    lineHeight: 1.2,
    marginTop: theme.spacing(1.5),
    color: theme.colors.text + "80",
  },
  error: {
    fontSize: 13,
    lineHeight: 1.2,
    fontWeight: 600,
    marginTop: theme.spacing(1.5),
    color: theme.colors.red,
  },
  multiLineInput: {
    textAlign: "left",
    padding: theme.spacing(0, 1),
  },
}));

// ApeTextField
//
// Using the same interface as MaterialUI's TextField to make it compatible
// with the the calendar.
export const ApeTextField = (props: TextFieldProps) => {
  const classes = useStyles();
  const [fallbackId] = useState(uniqueId("text-field-"));

  // Using:
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/InputBase/InputBase.js
  const {
    // For InputProps:
    InputProps,
    "aria-describedby": ariaDescribedby,
    autoComplete,
    autoFocus,
    className,
    defaultValue,
    disabled,
    error,
    fullWidth,
    helperText,
    id,
    inputProps,
    inputRef,
    label,
    margin,
    multiline,
    name,
    onBlur,
    onChange,
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    placeholder,
    // TextField props we want:
    // error,
    rows,
    rowsMax,
    type,
    value,
    // TODO: think about implementing:
    // color,
    // classes: textFieldClasses,
    // ...nonInputProps
  } = props;

  const inputClasses = {
    ...InputProps?.classes,
    root: clsx(
      classes.inputRoot,
      {
        [classes.inputRootError]: !!error,
      },
      InputProps?.classes?.root
    ),
    input: clsx(
      classes.input,
      { [classes.multiLineInput]: multiline },
      InputProps?.classes?.input
    ),
  };

  const mergedInputProps = {
    ...InputProps,
    ["aria-describedby"]: ariaDescribedby,
    classes: inputClasses,
    autoComplete,
    autoFocus,
    defaultValue,
    disabled,
    error,
    fullWidth,
    id: id ?? fallbackId,
    inputProps,
    inputRef,
    margin:
      margin === "dense" ? "dense" : ("none" as "dense" | "none" | undefined),
    multiline,
    name,
    onBlur,
    onChange,
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    placeholder,
    rows,
    rowsMax,
    type,
    value,
  } as InputBaseProps;

  return (
    <div
      className={clsx(
        className,
        classes.root,
        fullWidth && classes.rootFullWidth
      )}
    >
      {label ? (
        <label className={classes.label} htmlFor={id ?? fallbackId}>
          {label}
        </label>
      ) : undefined}
      <InputBase {...mergedInputProps} />
      {helperText ? (
        <span
          className={clsx({
            [classes.helper]: !error,
            [classes.error]: !!error,
          })}
        >
          {helperText}
        </span>
      ) : undefined}
    </div>
  );
};
