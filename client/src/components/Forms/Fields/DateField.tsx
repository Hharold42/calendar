import React, { useState, useRef, useEffect, type JSX } from "react";
import FieldWrapper from "./FieldWrapper";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./Field.module.scss";

interface DateFieldProps {
  label: string;
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  error?: string;
}

export default function DateField({
  label,
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  required = false,
  disabled = false,
  name,
  error,
}: DateFieldProps): JSX.Element {
  const [displayValue, setDisplayValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [hasBlurred, setHasBlurred] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Инициализация displayValue при изменении value
  useEffect(() => {
    if (value) {
      setDisplayValue(value);
      setIsValid(true);
    } else {
      setDisplayValue("");
      setIsValid(true);
    }
  }, [value]);

  // Функция форматирования ввода с маской MM/DD/YYYY
  const formatInput = (input: string) => {
    const digits = input.replace(/\D/g, "");
    let formatted = "";

    if (digits.length >= 1) {
      formatted = digits.substring(0, 2);
    }
    if (digits.length >= 3) {
      formatted += "/" + digits.substring(2, 4);
    }
    if (digits.length >= 5) {
      formatted += "/" + digits.substring(4, 8);
    }

    return formatted;
  };

  // Валидация даты в формате MM/DD/YYYY
  const validateDate = (dateStr: string) => {
    if (!dateStr || dateStr.length < 10) return false;

    const [month, day, year] = dateStr.split("/").map(Number);
    if (!month || !day || !year) return false;

    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      date >= new Date()
    );
  };

  // Проверка на неполную дату
  const hasIncompleteDate = (dateStr: string) => {
    if (!dateStr) return false;
    return dateStr.length > 0 && dateStr.length < 10;
  };

  // Обработчик изменения ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatInput(input);
    setDisplayValue(formatted);

    const valid = validateDate(formatted);
    setIsValid(valid);

    // Сохраняем в формате MM/DD/YYYY
    const event = {
      target: { name, value: formatted },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  // Обработчик потери фокуса
  const handleBlur = () => {
    setHasBlurred(true);
    if (displayValue && (!isValid || hasIncompleteDate(displayValue))) {
      setIsValid(false);
    }
  };

  // Обработчик нажатия клавиш
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const cursorPos = inputRef.current?.selectionStart || 0;
      if (cursorPos > 0 && displayValue[cursorPos - 1] === "/") {
        e.preventDefault();
        const newValue =
          displayValue.slice(0, cursorPos - 2) + displayValue.slice(cursorPos);
        setDisplayValue(newValue);
        const event = {
          target: { name, value: newValue },
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(event);
      }
    }
  };

  // Определяем, есть ли ошибка
  const hasError =
    (hasBlurred && !isValid && displayValue) ||
    hasIncompleteDate(displayValue) ||
    error;

  return (
    <FieldWrapper label={label} required={required} error={error}>
      <div
        className={
          styles.field__input +
          " " +
          styles[`field__input--search`] +
          " " +
          (displayValue ? styles[`field__input--filled`] : "") +
          " " +
          (hasError ? styles[`field__input--error`] : "")
        }
      >
        <Icon id="calendar" size={16} />
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
        />
      </div>
    </FieldWrapper>
  );
}