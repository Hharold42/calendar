import type { JSX, ReactNode } from "react";
import styles from "./Field.module.scss";
import { TextField, NumberField, DateField, TimeField, SelectField, TextareaField } from './index';
import type { SelectOption } from './index';

type FieldProps = {
  label: string;
  type: "text" | "number" | "date" | "time" | "select" | "textarea";
  placeholder?: string;
  options?: SelectOption[]; // для select
  value?: string | number;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  children?: ReactNode; // на случай, если нужны кастомные элементы
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string; // сообщение об ошибке
  // Дополнительные пропсы для разных типов полей
  min?: string | number;
  max?: string | number;
  step?: number;
  rows?: number; // для textarea
  maxLength?: number; // для textarea
  name?: string;
};

export default function Field({
  label,
  type,
  placeholder,
  options = [],
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  error,
  min,
  max,
  step,
  rows,
  maxLength,
  name,
  ...props
}: FieldProps): JSX.Element {
  // Используем специализированные компоненты для каждого типа поля
  switch (type) {
    case "text":
      return (
        <TextField
          label={label}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={className}
          name={name}
          error={error}
        />
      );

    case "number":
      return (
        <NumberField
          label={label}
          placeholder={placeholder}
          value={value as number}
          onChange={onChange}
          min={min as number}
          max={max as number}
          step={step}
          required={required}
          disabled={disabled}
          className={className}
          name={name}
          error={error}
        />
      );

    case "date":
      return (
        <DateField
          label={label}
          value={value as string | null}
          onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          name={name}
          error={error}
        />
      );

    case "time":
      return (
        <TimeField
          label={label}
          value={value as string}
          onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
          required={required}
          disabled={disabled}
          name={name}
          error={error}
        />
      );

    case "select":
      return (
        <SelectField
          label={label}
          placeholder={placeholder}
          options={options}
          value={value as string}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={className}
          name={name}
          error={error}
        />
      );

    case "textarea":
      return (
        <TextareaField
          label={label}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange}
          rows={rows}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          className={className}
          name={name}
          error={error}
        />
      );

    default:
      // Fallback для неизвестных типов
      return (
        <div className={`${styles.field} ${className}`}>
          <div className={styles.field__label}>{label}</div>
          <input
            type="text"
            className={styles.field__input}
            placeholder={placeholder}
            value={value || ""}
            onChange={onChange}
            disabled={disabled}
            name={name}
            {...props}
          />
        </div>
      );
  }
}
