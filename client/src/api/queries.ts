import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDayStatuses,
  getAppointments,
  getMasters,
  getServices,
  postAppointment,
} from "./endpoints";
import type { GetAppointmentsQuery, CreateAppointmentRequest } from "./types";

export const queryKeys = {
  dayStatuses: (year: number, month: number) => ["dayStatuses", year, month],
  appointments: (params: GetAppointmentsQuery) => [
    "appointments",
    JSON.stringify(params.masterIds || []),
    JSON.stringify(params.serviceIds || []),
    params.search || "",
    params.since,
    params.until,
  ],
  masters: (search?: string) => ["masters", search],
  services: (search?: string) => ["services", search],
  initialMasters: () => ["initialMasters"],
  initialServices: () => ["initialServices"],
};

export const useDayStatuses = (year: number, month: number) => {
  return useQuery({
    queryKey: queryKeys.dayStatuses(year, month),
    queryFn: () => getDayStatuses(year, month),
    staleTime: 10 * 60 * 1000,
  });
};

export const useAppointments = (params: GetAppointmentsQuery) => {
  console.log(JSON.stringify(params));

  return useQuery({
    queryKey: queryKeys.appointments(params),
    queryFn: () =>
      getAppointments({
        since: params.since,
        until: params.until,
        masterIds: params.masterIds,
        serviceIds: params.serviceIds,
        search: params.search,
        page: params.page,
        perPage: params.perPage,
      }),
    // staleTime: 2 * 60 * 1000,
    // staleTime: 0,
  });
};

export const useMasters = (search = "") => {
  return useQuery({
    queryKey: queryKeys.masters(search),
    queryFn: () => getMasters(search),
    staleTime: 30 * 60 * 1000,
  });
};

export const useInitialMasters = () => {
  return useQuery({
    queryKey: queryKeys.initialMasters(),
    queryFn: () => getMasters(""),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export const useServices = (search = "") => {
  return useQuery({
    queryKey: queryKeys.services(search),
    queryFn: () => getServices(search),
    staleTime: 30 * 60 * 1000,
  });
};

export const useInitialServices = () => {
  return useQuery({
    queryKey: queryKeys.initialServices(),
    queryFn: () => getServices(""),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};

export const useCachedServices = () => {
  const { data, isLoading, error, refetch } = useInitialServices();

  return {
    data: data?.data || [],
    isLoading,
    error,
    refetch,
    search: (searchTerm: string) => {
      if (!data?.data) return [];
      if (!searchTerm) return data.data;

      return data.data.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  };
};

export const useCachedMasters = () => {
  const { data, isLoading, error, refetch } = useInitialMasters();

  return {
    data: data?.data || [],
    isLoading,
    error,
    refetch,
    search: (searchTerm: string) => {
      if (!data?.data) return [];
      if (!searchTerm) return data.data;

      return data.data.filter((master) =>
        master.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  };
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) => postAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
