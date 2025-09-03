import { http } from './client'
import type {
  CreateAppointmentRequest,
  CreateAppointmentResponse,
  GetAppointmentsQuery,
  GetAppointmentsResponse,
  GetDayStatusesResponse,
} from './types'

export const getDayStatuses = (year: number, month: number) =>
  http.get<GetDayStatusesResponse>('/day-statuses', { year, month })

export const getAppointments = (q: GetAppointmentsQuery) =>
  http.get<GetAppointmentsResponse>('/appointments', q as unknown as Record<string, unknown>)

export const postAppointment = (body: CreateAppointmentRequest) =>
  http.post<CreateAppointmentResponse>('/appointments', body)

export const getMasters = (search = '') => http.get<{ data: any[] }>('/masters', { search })
export const getServices = (search = '') => http.get<{ data: any[] }>('/services', { search })


