import { useMemo, type JSX, memo } from "react";
import type { CalendarCellProps } from "../Calendar.types";
import styles from "./CalendarCell.module.scss";
import AppointmentComponent from "./Appointment/Appointment";
import today from "../../../assets/today.png";
import getTextWidth from "@/utils/getTextWidth";

const CalendarCell = memo(({ 
  cell, 
  onDayClick 
}: { 
  cell: CalendarCellProps;
  onDayClick?: (date: Date) => void;
}): JSX.Element => {
  const variant = useMemo(() => {
    if (!cell.inCurrentMonth) return "othermonth";
    if (cell.isToday) return "today";
    if (cell.status === "blocked") return "blocked";
    if (cell.status === "closed") return "closed";
    if (cell.isPast) return "past";
    return "default";
  }, [cell.inCurrentMonth, cell.status, cell.isPast, cell.isToday]);

  const isDisabled = useMemo(
    () => cell.isPast || !cell.inCurrentMonth || cell.status === "blocked" || cell.status === "closed",
    [cell.isPast, cell.inCurrentMonth, cell.status]
  );

  const isClickable = useMemo(
    () => cell.inCurrentMonth && !cell.isPast && cell.status !== "blocked" && cell.status !== "closed",
    [cell.inCurrentMonth, cell.isPast, cell.status]
  );

  // Динамически вычисляем размер и позицию картинки
  const imageStyles = useMemo(() => {
    if (!cell.isToday) return {};

    const numberText = cell.date.getDate().toString();
    const font = "28px Inter"; // совпадает с day__number
    const numberWidth = getTextWidth(numberText, font);

    const imageWidth = numberWidth + 12; // ширина числа + 4px
    const imageLeft = 4; // на 2px левее числа (число отступает 8px)

    return {
      width: `${imageWidth}px`,
      left: `${imageLeft}px`,
      top: `0px`,
    };
  }, [cell.isToday, cell.date]);

  const handleClick = () => {
    if (isClickable && onDayClick) {
      onDayClick(cell.date);
    }
  };

  return (
    <td 
      className={`${styles.day} ${styles[`day--${variant}`]} ${isClickable ? styles['day--clickable'] : ''}`}
      onClick={handleClick}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
    >
      <div className={styles.day__content}>
        <div className={styles.day__top}>
          <div className={styles.day__number__container}>
            <div className={styles.day__number}>{cell.date.getDate()}</div>
            {cell.isToday && (
              <div className={styles.day__today__text}>Today</div>
            )}
          </div>
          {cell.status !== "working" && (
            <div className={styles.day__status}>{cell.status}</div>
          )}
        </div>

        {cell.appointments.length <= 2 ? (
          <div className={styles.day__appointments}>
            {cell.appointments.map((appointment) => (
              <AppointmentComponent
                key={appointment.id}
                appointment={appointment}
                disabled={isDisabled}
              />
            ))}
          </div>
        ) : (
          <div className={styles.day__appointments}>
            <AppointmentComponent
              appointment={cell.appointments[0]}
              disabled={isDisabled}
            />
            <div
              className={`${styles.day__appointments__more} ${
                isDisabled && styles["day__appointments__more--disabled"]
              }`}
            >
              +{cell.appointments.length - 1} More
            </div>
          </div>
        )}
      </div>
      {cell.isToday && (
        <img src={today} className={styles.day__today} style={imageStyles} />
      )}
    </td>
  );
});

export default CalendarCell;
