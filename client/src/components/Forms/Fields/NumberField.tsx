import type { JSX } from "react";
import styles from "./Field.module.scss";
import FieldWrapper from "./FieldWrapper";

type NumberFieldProps = {
  label: string;
  placeholder?: string;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  error?: string;
};

export default function NumberField({
  label,
  placeholder,
  value,
  onChange,
  min,
  max,
  step = 1,
  required = false,
  disabled = false,
  className = "",
  name,
  error,
}: NumberFieldProps): JSX.Element {
  return (
    <FieldWrapper
      label={label}
      required={required}
      disabled={disabled}
      className={className}
      error={error}
    >
      <input
        type="number"
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
        min={min}
        max={max}
        step={step}
        required={required}
        disabled={disabled}
        name={name}
      />
    </FieldWrapper>
  );
}
