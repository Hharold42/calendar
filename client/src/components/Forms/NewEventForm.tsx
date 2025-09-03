import type { JSX } from "react";
import DrawerForm from "./DrawerFrom";
import styles from "./Form.module.scss";
import Icon from "../ui/Icon/Icon";
import Field from "./Fields/Field";
import {
  useCachedServices,
  useCachedMasters,
  useCreateAppointment,
} from "../../api/queries";
import { useState, useEffect } from "react";
import type {
  AppointmentStatus,
  CreateAppointmentRequest,
} from "../../api/types";
import Radio from "../ui/Button/Radio";
import TextareaField from "./Fields/TextareaField";
import requestFormat from "../../utils/requestFormat";
import {
  validateRequiredFields,
  hasNoErrors,
} from "../../utils/formValidation";

type NewEventFormProps = {
  onSuccess?: () => void;
  initialDate?: Date | null;
};

export default function NewEventForm({
  onSuccess,
  initialDate,
}: NewEventFormProps): JSX.Element {
  const [formData, setFormData] = useState<CreateAppointmentRequest>({
    customerName: "",
    service: "",
    master: "",
    at: (() => {
      if (initialDate) {
        const month = String(initialDate.getMonth() + 1).padStart(2, "0");
        const day = String(initialDate.getDate()).padStart(2, "0");
        const year = initialDate.getFullYear();
        return `${month}/${day}/${year}`;
      }
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const year = today.getFullYear();
      return `${month}/${day}/${year}`;
    })(),
    time: (() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const h12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const ampm = hours >= 12 ? "PM" : "AM";
      return `${h12.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;
    })(),
    status: "new",
    notes: "",
  });

  // Обновляем дату при изменении initialDate
  useEffect(() => {
    if (initialDate) {
      const month = String(initialDate.getMonth() + 1).padStart(2, "0");
      const day = String(initialDate.getDate()).padStart(2, "0");
      const year = initialDate.getFullYear();
      const dateString = `${month}/${day}/${year}`;
      setFormData((prev) => ({
        ...prev,
        at: dateString,
      }));
    }
  }, [initialDate]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: services } = useCachedServices();
  const { data: masters } = useCachedMasters();

  const createAppointmentMutation = useCreateAppointment();

  const requiredFields: (keyof CreateAppointmentRequest)[] = [
    "customerName",
    "service",
    "master",
    "at",
    "time",
  ];

  const validateForm = (): boolean => {
    const newErrors = validateRequiredFields(formData, requiredFields);
    setErrors(newErrors);
    return hasNoErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (createAppointmentMutation.isPending) return;
    if (!validateForm()) {
      return;
    }

    try {
      const formattedData = requestFormat(formData);

      await createAppointmentMutation.mutateAsync(formattedData);

      onSuccess?.();
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Ошибка при создании записи: " + (error as Error).message);
    }
  };

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.name,
  }));

  const masterOptions = masters.map((master) => ({
    value: master.id,
    label: master.name,
  }));

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRadioChange = (status: AppointmentStatus) => {
    setFormData((prev) => ({
      ...prev,
      status,
    }));
  };

  return (
    <DrawerForm
      onSubmit={handleSubmit}
      disabled={createAppointmentMutation.isPending}
    >
      <div className={styles.form__line}>
        <div className={styles.form__icon}>
          <Icon id="user" size={20} />
        </div>
        <Field
          label="Customer name"
          type="text"
          placeholder="Enter customer name"
          value={formData.customerName}
          onChange={handleChange}
          name="customerName"
          required
          error={errors.customerName}
        />
        <Field
          label="Service"
          type="select"
          placeholder="Select service"
          options={serviceOptions}
          value={formData.service}
          onChange={handleChange}
          name="service"
          required
          error={errors.service}
        />
      </div>
      <div className={styles.form__line}>
        <div className={styles.form__icon}>
          <Icon id="clock" size={20} />
        </div>
        <Field
          label="Date"
          type="date"
          placeholder="10/09/2024"
          value={formData.at}
          onChange={handleChange}
          name="at"
          required
          error={errors.at}
        />
        <Field
          label="Time"
          type="time"
          placeholder="Select time"
          value={formData.time}
          onChange={handleChange}
          name="time"
          required
          error={errors.time}
        />
      </div>
      <div className={styles.form__line}>
        <div className={styles.form__icon}>
          <Icon id="user" size={20} />
        </div>
        <Field
          label="Master"
          type="select"
          placeholder="Select master"
          options={masterOptions}
          value={formData.master}
          onChange={handleChange}
          name="master"
          required
          error={errors.master}
        />
        <div style={{ flex: 1 }}></div>
      </div>

      <div className={styles.form__line}>
        <Radio
          label="New"
          value={formData.status === "new"}
          onClick={() => handleRadioChange("new")}
        />
        <Radio
          label="Confirmed"
          value={formData.status === "confirmed"}
          onClick={() => handleRadioChange("confirmed")}
        />
        <Radio
          label="Paid"
          value={formData.status === "paid"}
          onClick={() => handleRadioChange("paid")}
        />
      </div>

      <div className={styles.form__line}>
        <TextareaField
          label="Notes"
          placeholder="Enter here"
          value={formData.notes}
          onChange={handleChange}
          name="notes"
          required={false}
        />
      </div>
    </DrawerForm>
  );
}
