import type { JSX } from "react";
import styles from "./Form.module.scss";
import Button from "../ui/Button/Button";

export default function DrawerForm({
  children,
  onSubmit,
  buttonText = "Submit",
  disabled = false,
}: {
  children: React.ReactNode;
  onSubmit: () => void;
  buttonText?: string;
  disabled?: boolean;
}): JSX.Element {
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={styles.form}>
      <div className={styles.form__content}>{children}</div>
      <Button onClick={handleSubmit} disabled={disabled}>
        {buttonText}
      </Button>
    </div>
  );
}
