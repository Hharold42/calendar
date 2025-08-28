import { useEffect, useMemo, useState } from "react";
import { getAppointments, getDayStatuses } from "../../api/endpoints";
import type { Appointment, CalendarFilters, DayStatus } from "../../api/types";

function monthRange(year: number, month: number) {
  const since = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  const until = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
  return { since: since.toISOString(), until: until.toISOString() };
}

export function useCalendarData(
  year: number,
  month: number,
  filters: CalendarFilters
) {
  const [statuses, setStatuses] = useState<Record<string, DayStatus[]>>({});
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { since, until } = useMemo(
    () => monthRange(year, month),
    [year, month]
  );

  useEffect(() => {
    let aborted = false;
    setLoading(true);
    setError(null);

    Promise.all([
      // Получаем статусы для текущего месяца
      getDayStatuses(year, month).then((r) => r.data),
      // Получаем статусы для предыдущего месяца
      getDayStatuses(year, month - 1).then((r) => r.data),
      // Получаем статусы для следующего месяца
      getDayStatuses(year, month + 1).then((r) => r.data),
      // Получаем встречи
      getAppointments({
        since,
        until,
        masterIds: filters.masterIds,
        serviceIds: filters.serviceIds,
        search: filters.search,
        perPage: 1000,
      }).then((r) => r.data),
    ])
      .then(([currentMonth, prevMonth, nextMonth, a]) => {
        if (aborted) return;
        setStatuses({
          current: currentMonth,
          previous: prevMonth,
          next: nextMonth,
        });
        setAppointments(a);
      })
      .catch((e) => {
        if (!aborted) {
          console.error("API error:", e);
          setError(e instanceof Error ? e.message : String(e));
        }
      })
      .finally(() => !aborted && setLoading(false));

    return () => {
      aborted = true;
    };
  }, [
    year,
    month,
    since,
    until,
    filters.masterIds,
    filters.serviceIds,
    filters.search,
  ]);

  return { statuses, appointments, loading, error };
}
