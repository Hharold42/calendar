import { useMemo, useState, useCallback, type JSX, useEffect } from "react";
import styles from "./App.module.scss";
import Calendar from "./components/Calendar/Calendar";
import { useCalendarData } from "./components/Calendar/useCalendarData";
import type { CalendarFilters } from "./api/types";
import Button from "./components/ui/Button/Button";
import Icon from "./components/ui/Icon/Icon";
import Drawer from "./components/ui/Drawer/Drawer";
import NewEventForm from "./components/Forms/NewEventForm";
import DataPreloader from "./components/DataPreloader";
import FilterForm from "./components/Forms/FilterForm";

type FormConfig = {
  title: string;
  size: "sm" | "md" | "lg";
  form: React.ReactNode;
};

export default function App(): JSX.Element {
  const today = useMemo(() => new Date(), []);
  const [isDrawerOpen, setIsDrawerOpen] = useState<
    "addEvent" | "filter" | null
  >(null);
  const [filters, setFilters] = useState<CalendarFilters>({
    masterIds: [],
    serviceIds: [],
    search: "",
  });

  const formsConfig: Record<string, FormConfig> = {
    addEvent: {
      title: "New event",
      size: "md",
      form: <NewEventForm onSuccess={() => setIsDrawerOpen(null)} />,
    },
    filter: {
      title: "Filters",
      size: "sm",
      form: (
        <FilterForm
          onSuccess={(filters: CalendarFilters) => {
            setFilters(filters);
            setIsDrawerOpen(null);
          }}
          filters={filters}
        />
      ),
    },
  };

  const handleDrawerOpen = useCallback((modal: "addEvent" | "filter") => {
    setIsDrawerOpen(modal);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(null);
  }, []);

  const [ym, setYm] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const { statuses, appointments, loading, error } = useCalendarData(
    ym.year,
    ym.month,
    filters
  );

  const handleMonthChange = useCallback((year: number, month: number) => {
    setYm({ year, month });
  }, []);

  return (
    <DataPreloader>
      <div className={styles.app}>
        <div className={styles.content}>
          <div className={styles.content__header}>
            <Button
              icon={<Icon id="plus" size={24} />}
              onClick={() => handleDrawerOpen("addEvent")}
            >
              Add event
            </Button>
          </div>
          {loading && <div>Loading…</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}

          <Calendar
            year={ym.year}
            month={ym.month}
            statuses={statuses}
            appointments={appointments}
            onDayClick={() => {}}
            onMonthChange={handleMonthChange}
            onFilterClick={() => handleDrawerOpen("filter")}
          />
          {isDrawerOpen && (
            <Drawer
              title={formsConfig[isDrawerOpen].title}
              onClose={handleDrawerClose}
              size={formsConfig[isDrawerOpen].size as "sm" | "md" | "lg"}
              form={isDrawerOpen}
            >
              {formsConfig[isDrawerOpen].form}
            </Drawer>
          )}
        </div>
      </div>
    </DataPreloader>
  );
}
