// API types (based on api.md)
export type DayStatus = 'working' | 'closed' | 'blocked'

export interface Service { id: string; name: string }
export interface Master { id: string; name: string; avatarUrl: string; services: Service[] }

export type AppointmentStatus = 'new' | 'confirmed' | 'paid' | 'cancelled'
export interface Appointment {
  id: string
  customerName: string
  at: string // ISO
  service: Service
  master: Master
  notes: string | null
  status: AppointmentStatus
}

export interface GetDayStatusesResponse { data: DayStatus[] }

export interface GetAppointmentsQuery {
  since: string
  until: string
  serviceIds?: string[]
  masterIds?: string[]
  search?: string
  page?: number
  perPage?: number
}
export interface GetAppointmentsResponse { data: Appointment[]; total: number }

export interface CreateAppointmentRequest {
  at: string
  serviceId: string
  masterId: string
  customerName: string
  notes?: string | null
  status: 'new' | 'confirmed' | 'paid'
}
export interface CreateAppointmentResponse { data: Appointment }

// UI types
export interface CalendarFilters {
  masterIds: string[]
  serviceIds: string[]
  search: string
}


