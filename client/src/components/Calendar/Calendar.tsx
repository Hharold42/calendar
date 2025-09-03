import type { CalendarCellProps, CalendarProps } from "./Calendar.types.ts";
import type { DayStatus } from "../../api/types";
import styles from "./Calendar.module.scss";
import Button from "../ui/Button/Button";
import Icon from "../ui/Icon/Icon";
import CalendarCell from "./Cell/CalendarCell.tsx";
import { useCallback, useMemo, memo } from "react";

function makeMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  const offset = start.getDay();
  start.setDate(first.getDate() - offset);

  const cells: Date[] = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  return cells;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function serializeMonthToWeeks(
  cells: CalendarCellProps[]
): CalendarCellProps[][] {
  const weeks: CalendarCellProps[][] = [];

  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7);
    weeks.push(week);
  }

  const islastweekinmonth = weeks.at(-1)?.every((cell) => !cell.inCurrentMonth);

  if (islastweekinmonth) weeks.pop();

  return weeks;
}

const Calendar = memo(({
  year,
  month,
  statuses,
  appointments,
  onDayClick,
  onMonthChange,
  onFilterClick,
}: CalendarProps) => {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const go = useCallback((delta: number) => {
    const d = new Date(year, month + delta, 1);
    onMonthChange(d.getFullYear(), d.getMonth());
  }, [year, month, onMonthChange]);

  const cells: CalendarCellProps[] = useMemo(() => {
    return makeMatrix(year, month).map((d) => {
      const inMonth = d.getMonth() === month;
      const isToday = sameDay(d, today);
      const d0 = new Date(d);
      d0.setHours(0, 0, 0, 0);
      const isPast = d0 < today;

      // Находим статус для любого дня на календаре
      let status: DayStatus | undefined;
      if (statuses) {
        if (d.getMonth() === month) {
          // Текущий месяц - сдвигаем на +1 день
          status = statuses.current?.[d.getDate() - 1];
        } else if (
          d.getMonth() === month - 1 ||
          (month === 0 && d.getMonth() === 11)
        ) {
          status = statuses.previous?.[d.getDate() - 1];
        } else if (
          d.getMonth() === month + 1 ||
          (month === 11 && d.getMonth() === 0)
        ) {
          // Следующий месяц - сдвигаем на +1 день
          status = statuses.next?.[d.getDate() - 1];
        }
      }
      const dayAppointments = (appointments ?? []).filter((a) =>
        sameDay(new Date(a.at), d)
      );

      return {
        date: d,
        inCurrentMonth: inMonth,
        isToday,
        isPast,
        status,
        appointments: dayAppointments,
      };
    });
  }, [year, month, today, statuses, appointments]);

  const weeks = useMemo(() => {
    return serializeMonthToWeeks(cells);
  }, [cells]);

  return (
    <div className={styles.calendar}>
      <div className={styles.calendar__header}>
        <div className={styles.calendar__month}>
          <span className={styles.calendar__month__title}>
            {new Date(year, month).toLocaleString("en", {
              month: "long",
            })}
            , {year}
          </span>
          <button onClick={() => go(-1)}>
            <Icon id="chevron-left" size={24} color="white" />
          </button>
          <button onClick={() => go(1)}>
            <Icon id="chevron-right" size={24} color="white" />
          </button>
        </div>
        <Button
          variant="secondary"
          icon={<Icon id="filter" color="white" size={24} />}
          onClick={onFilterClick}
        >
          Filters
        </Button>
      </div>

      <div className={styles.calendar__tableContainer}>
        <div className={styles.calendar__weekdays}>
          <div
            className={
              styles.calendar__weekday +
              " " +
              styles[`calendar__weekday--weekend`]
            }
          >
            Sunday
          </div>
          <div className={styles.calendar__weekday}>Monday</div>
          <div className={styles.calendar__weekday}>Tuesday</div>
          <div className={styles.calendar__weekday}>Wednesday</div>
          <div className={styles.calendar__weekday}>Thursday</div>
          <div className={styles.calendar__weekday}>Friday</div>
          <div
            className={
              styles.calendar__weekday +
              " " +
              styles[`calendar__weekday--weekend`]
            }
          >
            Saturday
          </div>
        </div>
        <div className={styles.calendar__tableWrapper}>
          <table className={styles.calendar__table}>
            <tbody className={styles.calendar__days}>
              {weeks.map((week, weekIndex) => (
                <tr key={weekIndex} className={styles.calendar__week}>
                  {week.map((cell, dayIndex) => (
                    <CalendarCell cell={cell} key={dayIndex} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default Calendar;
