import type { JSX } from "react";
import type { Appointment } from "../../../../api/types";
import styles from "./Appointment.module.scss";
import { memo } from "react";

const AppointmentComponent = memo(({
  appointment,
  disabled,
}: {
  appointment: Appointment;
  disabled?: boolean;
}): JSX.Element => {
  // время с am pm
  const time12 = new Date(appointment.at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      className={`${styles.appointment} ${
        disabled
          ? styles["appointment--disabled"]
          : styles[`appointment--${appointment.status}`]
      }`}
    >
      <div className={styles.appointment__time}>{time12}</div>
      <div className={styles.divider}></div>
      <div className={styles.appointment__name}>{appointment.master.name}</div>
    </div>
  );
});

export default AppointmentComponent;
