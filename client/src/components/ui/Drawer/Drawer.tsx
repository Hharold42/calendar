import type { JSX } from "react";
import styles from "./Drawer.module.scss";
import Icon from "../Icon/Icon";
import { memo, useState, useEffect } from "react";

type DrawerProps = {
  children: React.ReactNode;
  size: "sm" | "md" | "lg";
  title: string;
  onClose: () => void;
  form: "addEvent" | "filter";
};

export default memo(function Drawer({
  children,
  size,
  title,
  onClose,
  form
}: DrawerProps): JSX.Element {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Анимация открытия
    setIsVisible(true);
    setIsAnimating(true);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Время анимации

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(true);
    setIsVisible(false);

    setTimeout(() => {
      onClose();
    }, 300); // Время анимации
  };

  return (
    <div
      className={`${styles.drawer__wrapper} ${isVisible ? styles.visible : ""}`}
      onClick={handleClose}
    >
      <div
        className={`${styles.drawer} ${styles[`drawer--${size}`]} ${
          isAnimating ? styles.animating : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.drawer__header}>
          <div className={styles.drawer__title}>{title}</div>
          <div className={styles.drawer__icons}>
            {form === "filter" && (
              <div className={styles.reset}>
                <Icon id="reset" size={24} onClick={handleClose} /> Reset all
              </div>
            )}
            <Icon id="close" size={24} onClick={handleClose} />
          </div>
        </div>
        <div className={styles.drawer__content}>{children}</div>
      </div>
    </div>
  );
});
