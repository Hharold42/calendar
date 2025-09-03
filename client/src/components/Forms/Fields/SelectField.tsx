import { useEffect, useRef, useState, type JSX } from "react";
import FieldWrapper from "./FieldWrapper";
import styles from "./Field.module.scss";
import Icon from "@/components/ui/Icon/Icon";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  options?: SelectOption[];
  error?: string;
};

export default function SelectField({
  label,
  placeholder,
  value,
  onChange,
  required,
  disabled,
  className,
  name,
  options,
  error,
}: SelectFieldProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (option: SelectOption) => {
    onChange?.({
      target: { name: name, value: option.value },
    } as React.ChangeEvent<HTMLInputElement>);
    setIsOpen(false);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <FieldWrapper
      label={label}
      required={required}
      disabled={disabled}
      className={className}
      error={error}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={
          styles.field__input +
          " " +
          (value ? styles[`field__input--filled`] : "") +
          " " +
          (error ? styles[`field__input--error`] : "")
        }
      >
        {value
          ? options?.find((option) => option.value === value)?.label
          : placeholder}

        <Icon
          id="chevron-down"
          size={16}
          className={
            styles.field__icon + " " + (isOpen && styles[`field__icon--open`])
          }
        />
      </div>
      {isOpen && (
        <div className={styles.field__options} ref={containerRef}>
          {options?.map((option, i) => (
            <div
              key={i}
              className={
                styles.option +
                " " +
                (value === option.value && styles[`option--selected`])
              }
              onClick={() => handleChange(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </FieldWrapper>
  );
}
