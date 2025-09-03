import { useMemo } from "react";
import { useDayStatuses, useAppointments } from "../../api/queries";
import type { CalendarFilters } from "../../api/types";

export function useCalendarData(
  year: number,
  month: number,
  filters: CalendarFilters
) {

  const currentMonth = useDayStatuses(year, month);
  const prevMonth = useDayStatuses(year, month - 1);
  const nextMonth = useDayStatuses(year, month + 1);

  const { since, until } = useMemo(() => {
    const since = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const until = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
    return { since: since.toISOString(), until: until.toISOString() };
  }, [year, month]);

  const appointments = useAppointments({
    since,
    until,
    masterIds: filters.masterIds,
    serviceIds: filters.serviceIds,
    search: filters.search,
    perPage: 1000,
  });

  const statuses = useMemo(() => {
    if (currentMonth.data && prevMonth.data && nextMonth.data) {
      return {
        current: currentMonth.data.data,
        previous: prevMonth.data.data,
        next: nextMonth.data.data,
      };
    }
    return null;
  }, [currentMonth.data, prevMonth.data, nextMonth.data]);

  const loading = currentMonth.isLoading || prevMonth.isLoading || nextMonth.isLoading || appointments.isLoading;
  
  const error = currentMonth.error || prevMonth.error || nextMonth.error || appointments.error;

  return {
    statuses,
    appointments: appointments.data?.data || null,
    loading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
  };
}
