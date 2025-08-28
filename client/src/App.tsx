import { useMemo, useState, type JSX } from "react";
import styles from "./App.module.scss";
import Calendar from "./components/Calendar/Calendar";
import { useCalendarData } from "./components/Calendar/useCalendarData";
import type { CalendarFilters } from "./api/types";
import Button from "./components/ui/Button/Button";
import Icon from "./components/ui/Icon/Icon";

export default function App(): JSX.Element {
  const today = useMemo(() => new Date(), []);
  const [ym, setYm] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [filters, setFilters] = useState<CalendarFilters>({
    masterIds: [],
    serviceIds: [],
    search: "",
  });

  const { statuses, appointments, loading, error } = useCalendarData(
    ym.year,
    ym.month,
    filters
  );

  const handleMonthChange = (year: number, month: number) => {
    setYm({ year, month });
  };

  return (
    <div className={styles.app}>
      <div className={styles.content}>
        <div className={styles.content__header}>
          <Button icon={<Icon id="plus" size={24} />}>Add event</Button>
        </div>
        
        {loading && <div>Loading…</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}

        <Calendar
          year={ym.year}
          month={ym.month}
          statuses={statuses}
          appointments={appointments}
          onDayClick={(date) => {
            console.log("day click", date);
          }}
          onMonthChange={handleMonthChange}
        />
      </div>
    </div>
  );
}
