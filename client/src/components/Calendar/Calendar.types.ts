import type { Appointment, DayStatus } from '../../api/types'

export interface CalendarProps {
  year: number
  month: number // 0..11
  statuses?: Record<string, DayStatus[]> | null
  appointments?: Appointment[] | null
  onDayClick?: (date: Date) => void
  onMonthChange: (year: number, month: number) => void
  onFilterClick?: () => void
}

export interface CalendarCellProps {
  date: Date
  inCurrentMonth: boolean
  isToday: boolean
  isPast: boolean
  status?: DayStatus
  appointments: Appointment[]
}


