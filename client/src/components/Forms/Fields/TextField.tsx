import type { JSX } from "react";
import styles from "./Field.module.scss";
import FieldWrapper from "./FieldWrapper";

type TextFieldProps = {
  label?: string | null;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  error?: string;
  search?: boolean;
};

export default function TextField({
  label = null,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  name = "",
  error,
  search = false,
}: TextFieldProps): JSX.Element {
  return (
    <FieldWrapper
      label={label}
      required={required}
      disabled={disabled}
      className={className}
      error={error}
    >
      <input
        type="text"
        className={
          styles.field__input +
          " " +
          (value ? styles[`field__input--filled`] : "") +
          " " +
          (error ? styles[`field__input--error`] : "")
        }
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        required={required}
        disabled={disabled}
        name={name}
      ></input>
    </FieldWrapper>
  );
}
