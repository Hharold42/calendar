import React, { useEffect, useState, useRef } from "react";
import styles from "./Field.module.scss";
import FieldWrapper from "./FieldWrapper";

interface TimeFieldProps {
  label: string;
  value: string; // 12ч формат "hh:mm a" (например "02:30 PM")
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  error?: string;
}

const TimeField: React.FC<TimeFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  name,
  error,
}) => {
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");

  const hoursInputRef = useRef<HTMLInputElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);

  // при изменении внешнего value ("hh:mm a") -> парсим в локальное состояние
  useEffect(() => {
    if (!value) return;

    // Парсим формат "hh:mm a" (например "02:30 PM")
    const parts = value.split(" ");
    if (parts.length !== 2) return;

    const [timePart, ampmPart] = parts;
    const [h, m] = timePart.split(":").map(Number);

    if (isNaN(h) || isNaN(m)) return;

    setHours(h);
    setMinutes(m);
    setAmpm(ampmPart.toUpperCase() as "AM" | "PM");
  }, [value]);

  // конвертация в 12ч формат "hh:mm a"
  const to12h = (h: number, m: number, ap: "AM" | "PM") => {
    // Если часы равны 0, возвращаем пустую строку для очистки
    if (h === 0) return "";

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")} ${ap}`;
  };

  const emitChange = (
    newHours = hours,
    newMinutes = minutes,
    newAmPm = ampm
  ) => {
    const timeValue = to12h(newHours, newMinutes, newAmPm);
    onChange({
      target: { value: timeValue, name },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Разрешаем пустое значение для очистки
    if (inputValue === "") {
      setHours(0);
      emitChange(0, minutes, ampm);
      return;
    }

    let val = parseInt(inputValue);
    if (isNaN(val)) return; // Игнорируем нечисловые значения

    // Разрешаем 0 для очистки, но при валидации устанавливаем минимум 1
    if (val < 0) val = 0;
    if (val > 12) val = 12;

    setHours(val);

    // Если введено 2 символа, переходим к минутам
    if (inputValue.length === 2 && val > 0) {
      minutesInputRef.current?.focus();
    }

    emitChange(val, minutes, ampm);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Разрешаем пустое значение для очистки
    if (inputValue === "") {
      setMinutes(0);
      emitChange(hours, 0, ampm);
      return;
    }

    let val = parseInt(inputValue);
    if (isNaN(val)) return; // Игнорируем нечисловые значения

    if (val < 0) val = 0;
    if (val > 59) val = 59;
    setMinutes(val);
    emitChange(hours, val, ampm);
  };

  const toggleAmPm = () => {
    const newAmPm = ampm === "AM" ? "PM" : "AM";
    setAmpm(newAmPm);
    emitChange(hours, minutes, newAmPm);
  };

  return (
    <FieldWrapper label={label} required={required} error={error}>
      <div
           className={
          styles.field__input +
          " " +
          (value ? styles[`field__input--filled`] : "") +
          " " +
          styles[`field__input--time`] +
          " " +
          (error ? styles[`field__input--error`] : "") +
          " flex items-center gap-2"
        }
      >
        <div className={styles["time-field"]}>
          <input
            ref={hoursInputRef}
            type="text"
            value={hours === 0 ? "" : hours.toString().padStart(2, "0")}
            onChange={handleHoursChange}
            disabled={disabled}
            min={1}
            max={12}
            className={`${styles["time-field__input"]} ${styles["time-field__input--hours"]}`}
            placeholder="12"
          />
          :
          <input
            ref={minutesInputRef}
            type="text"
            value={minutes === 0 ? "" : minutes.toString().padStart(2, "0")}
            onChange={handleMinutesChange}
            disabled={disabled}
            min={0}
            max={59}
            className={`${styles["time-field__input"]} ${styles["time-field__input--minutes"]}`}
            placeholder="00"
          />
          <div onClick={toggleAmPm} className={styles["time-field__button"]}>
            {ampm}
          </div>
        </div>
      </div>
    </FieldWrapper>
  );
};

export default TimeField;
