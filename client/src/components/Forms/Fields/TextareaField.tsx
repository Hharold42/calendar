import type { JSX } from "react";
import styles from "./Field.module.scss";
import FieldWrapper from "./FieldWrapper";

type TextareaFieldProps = {
  label: string;
  placeholder?: string;
  value?: string | null;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  error?: string;
};

export default function TextareaField({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  maxLength,
  required = false,
  disabled = false,
  className = "",
  name,
  error,
}: TextareaFieldProps): JSX.Element {
  return (
    <FieldWrapper
      label={label}
      required={required}
      disabled={disabled}
      className={className}
      error={error}
    >
      <textarea
        className={`${styles.field__input} ${styles.field__textarea} ${value ? styles[`field__input--filled`] : ""} ${error ? styles[`field__input--error`] : ""}`}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        rows={rows}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        name={name}
      />
      {maxLength && (
        <div className={styles.field__counter}>
          {value?.length || 0}/{maxLength}
        </div>
      )}
    </FieldWrapper>
  );
}
