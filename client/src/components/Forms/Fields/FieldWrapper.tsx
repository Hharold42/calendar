import type { ReactNode } from "react";
import styles from "./Field.module.scss";

type FieldWrapperProps = {
  label: string | null;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  error?: string; // Маркер наличия ошибки (текст не показываем)
};

export default function FieldWrapper({
  label,
  className = "",
  children,
  required = false,
  error,
}: FieldWrapperProps) {
  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <div className={styles.field__label}>
          {label} {!required && " (optional)"}
        </div>
      )}
      {children}
      {/* Убираем отображение текста ошибки, только визуальное выделение */}
    </div>
  );
}
