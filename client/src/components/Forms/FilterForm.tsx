import { useCachedMasters, useCachedServices } from "@/api/queries";
import Section from "../ui/Section/CustomSection";
import DrawerForm from "./DrawerFrom";
import MultiSelect from "./Fields/MultiSelect";

import { useMemo, useState } from "react";
import type { CalendarFilters } from "@/api/types";

export default function FilterForm({
  onSuccess,
  filters,
}: {
  onSuccess: (filters: CalendarFilters) => void;
  filters: CalendarFilters;
}) {
  const [formData, setFormData] = useState<CalendarFilters>({
    serviceIds: filters.serviceIds,
    masterIds: filters.masterIds,
    search: "",
  });

  const { data: services } = useCachedServices();
  const { data: masters } = useCachedMasters();

  const serviceOptions = useMemo(
    () =>
      services.map((service) => ({
        value: service.id,
        label: service.name,
      })),
    [services]
  );

  const masterOptions = useMemo(
    () =>
      masters.map((master) => ({
        value: master.id,
        label: master.name,
      })),
    [masters]
  );

  const handleReset = () => {
    const resetFilters = {
      serviceIds: [],
      masterIds: [],
      search: "",
    };
    setFormData(resetFilters);
    onSuccess(resetFilters);
  };

  return (
    <DrawerForm
      onSubmit={() => {
        onSuccess(formData);
      }}
    >
      <Section title="Master" onReset={handleReset}>
        <MultiSelect
          options={masterOptions}
          value={formData.masterIds}
          onChange={(value) => setFormData({ ...formData, masterIds: value })}
        />
      </Section>
      <Section title="Service" onReset={handleReset}>
        <MultiSelect
          options={serviceOptions}
          value={formData.serviceIds}
          onChange={(value) => setFormData({ ...formData, serviceIds: value })}
        />
      </Section>
    </DrawerForm>
  );
}
