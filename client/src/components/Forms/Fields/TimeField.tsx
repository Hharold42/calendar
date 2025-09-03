import React, { useState, useRef, useEffect, type JSX } from "react";
import FieldWrapper from "./FieldWrapper";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./Field.module.scss";

interface TimeFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  error?: string;
}

export default function TimeField({
  label,
  value,
  onChange,
  placeholder = "HH:MM AM/PM",
  required = false,
  disabled = false,
  name,
  error,
}: TimeFieldProps): JSX.Element {
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

  // Функция форматирования ввода с маской HH:MM AM/PM
  const formatInput = (input: string) => {
    // Убираем все кроме цифр и букв
    const cleaned = input.replace(/[^\d\w]/g, "");
    let formatted = "";

    // Обрабатываем цифры для времени
    const digits = cleaned.replace(/\D/g, "");
    
    if (digits.length >= 1) {
      // Обрабатываем часы
      let hours = parseInt(digits.substring(0, 2), 10);
      if (hours > 12) {
        hours = 12;
      }
      
      // Если введена только одна цифра, оставляем как есть
      if (digits.length === 1) {
        formatted = hours.toString();
      } else {
        // Если введено две цифры, форматируем с ведущим нулем
        formatted = hours.toString().padStart(2, "0");
      }
    }
    
    // Добавляем двоеточие и минуты
    if (digits.length >= 3) {
      formatted += ":" + digits.substring(2, 4);
    }
    
    // Добавляем AM/PM после ввода 4 цифр (HH:MM)
    if (digits.length >= 4) {
      // Проверяем наличие A или P в вводе
      const hasA = cleaned.toUpperCase().includes("A");
      const hasP = cleaned.toUpperCase().includes("P");
      
      if (hasP) {
        formatted += " PM";
      } else if (hasA) {
        formatted += " AM";
      } else {
        // Автоматически добавляем AM если ничего не указано
        formatted += " AM";
      }
    }

    return formatted;
  };

  // Валидация времени в формате HH:MM AM/PM
  const validateTime = (timeStr: string) => {
    if (!timeStr || timeStr.length < 8) return false;

    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) return false;

    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);

    return hours >= 1 && hours <= 12 && minutes >= 0 && minutes <= 59;
  };

  // Проверка на валидное неполное время (для разрешения стирания)
  const isValidPartialTime = (timeStr: string) => {
    if (!timeStr) return true; // Пустая строка валидна
    
    // Проверяем частичное время
    if (timeStr.match(/^\d{1,2}$/)) {
      const hours = parseInt(timeStr, 10);
      return hours >= 0 && hours <= 12;
    }
    
    if (timeStr.match(/^\d{1,2}:\d{0,2}$/)) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours >= 0 && hours <= 12 && minutes >= 0 && minutes <= 59;
    }
    
    return false;
  };

  // Проверка на неполное время
  const hasIncompleteTime = (timeStr: string) => {
    if (!timeStr) return false;
    return timeStr.length > 0 && timeStr.length < 8;
  };

  // Обработчик изменения ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatInput(input);
    setDisplayValue(formatted);

    // Проверяем валидность - либо полное время, либо валидное частичное
    const valid = validateTime(formatted) || isValidPartialTime(formatted);
    setIsValid(valid);

    // Сохраняем в формате HH:MM AM/PM
    const event = {
      target: { name, value: formatted },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  // Обработчик нажатия клавиш для дополнительных ограничений
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = e.key;
    
    // Разрешаем только цифры, двоеточие, пробел, A, M, P
    if (!/[0-9:\sAPM]/i.test(char) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
      e.preventDefault();
    }
    
    // Убираем ограничение на часы - пусть formatInput сам обрабатывает
  };

  // Обработчик потери фокуса
  const handleBlur = () => {
    setHasBlurred(true);
    // Показываем ошибку только если время неполное и невалидное
    if (displayValue && hasIncompleteTime(displayValue) && !isValidPartialTime(displayValue)) {
      setIsValid(false);
    }
  };

  // Обработчик нажатия клавиш
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const cursorPos = inputRef.current?.selectionStart || 0;
      
      // Если пытаемся удалить двоеточие
      if (cursorPos > 0 && displayValue[cursorPos - 1] === ":") {
        e.preventDefault();
        const newValue =
          displayValue.slice(0, cursorPos - 2) + displayValue.slice(cursorPos);
        setDisplayValue(newValue);
        const event = {
          target: { name, value: newValue },
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(event);
      }
      // Если пытаемся удалить AM/PM (любую букву из AM или PM)
      else if (cursorPos > 0 && (displayValue[cursorPos - 1] === "A" || displayValue[cursorPos - 1] === "P" || displayValue[cursorPos - 1] === "M")) {
        e.preventDefault();
        // Удаляем весь AM или PM, но не добавляем автоматически
        const timePart = displayValue.substring(0, 5); // HH:MM
        setDisplayValue(timePart);
        setIsValid(true); // Считаем валидным
        
        // Не вызываем handleInputChange, чтобы не добавлялся автоматически AM
        const event = {
          target: { name, value: timePart },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    }
  };

  // Определяем, есть ли ошибка
  const hasError =
    (hasBlurred && !isValid && displayValue) ||
    hasIncompleteTime(displayValue) ||
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
        <Icon id="clock" size={16} />
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          name={name}
        />
      </div>
    </FieldWrapper>
  );
}