import type { JSX } from "react";
import styles from "./Radio.module.scss";

type RadioProps = {
  label: string;
  value: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function Radio({
  label,
  value,
  onClick,
}: RadioProps): JSX.Element {
  return (
    <div
      className={styles.radio + " " + (value ? styles["radio--active"] : "")}
      onClick={onClick}
    >
      <input
        type="radio"
        checked={value}
        className={styles.radio__input}
        readOnly
      />
      <label className={styles.radio__label}>{label}</label>
    </div>
  );
}
