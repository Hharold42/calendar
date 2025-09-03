import React, { useState } from "react";
import DatePicker from "react-datepicker";
import styles from "./Field.module.scss";
import FieldWrapper from "./FieldWrapper";
import Icon from "@/components/ui/Icon/Icon";
import { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale/en-US";

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
type DatePickerHeaderProps = {
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
};

console.log(enUS);


registerLocale("enUShort", {
  ...enUS,
  localize: {
    ...enUS.localize,
    day: (n: number) => {
      const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return shortDays[n];
    },
    
  },
});

const DateField: React.FC<DateFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  name,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (date: Date | null) => {
    // Сохраняем дату в формате YYYY-MM-DD как простую строку
    const dateValue = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : "";
    const event = {
      target: { name, value: dateValue },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onChange?.(event);
    setIsOpen(false);
  };

  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const CustomInput = () => {
    const dateFromInput = value && value.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(value + 'T00:00:00') : null;
    return (
      <div
        tabIndex={0}
        className={
          styles.field__input +
          " " +
          (value ? styles[`field__input--filled`] : "") +
          " " +
          styles[`field__input--date`] +
          " " +
          (error ? styles[`field__input--error`] : "")
        }
        onClick={() => setIsOpen(true)}
      >
        <Icon id="calendar" size={16} />
        {dateFromInput ? formatDateForDisplay(dateFromInput) : placeholder}
      </div>
    );
  };

  const customHeader = ({
    date,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: DatePickerHeaderProps) => {
    const monts = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return (
      <div className={"customHeader"}>
        <Icon id="chevron-left-circle" size={17} onClick={decreaseMonth} />
        <h3>{monts[date.getMonth()]}</h3>
        <Icon id="chevron-right-circle" size={17} onClick={increaseMonth} />
      </div>
    );
  };

  const dateFromInput = value && value.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(value + 'T00:00:00') : null;

  return (
    <FieldWrapper label={label} required={required} error={error}>
      <DatePicker
        selected={dateFromInput}
        onChange={handleDateChange}
        open={isOpen}
        onClickOutside={() => setIsOpen(false)}
        dateFormat="MM/dd/yyyy"
        placeholderText={placeholder}
        disabled={disabled}
        showPopperArrow={false}
        popperPlacement="bottom-start"
        customInput={<CustomInput />}
        // Кастомизация внешнего вида
        calendarClassName={styles.customDatePicker}
        showMonthDropdown={true}
        showYearDropdown={true}
        dropdownMode="select"
        yearDropdownItemNumber={10}
        dateFormatCalendar="MMMM yyyy"
        // Дополнительные настройки
        minDate={new Date()}
        maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // +1 год
        excludeDates={[]} // Даты для исключения
        highlightDates={[]} // Даты для выделения
        // Стили для дней недели
        dayClassName={(date) => {
          const day = date.getDay();
          return day === 0 || day === 6 ? "weekend-day" : "";
        }}
        renderCustomHeader={customHeader}
        locale="enUShort"
        useWeekdaysShort={true}
    
      />
    </FieldWrapper>
  );
};

export default DateField;
