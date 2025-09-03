import React, { useState, type JSX } from "react";
import Icon from "../Icon/Icon";
import styles from "./Section.module.scss";

type SectionProps = {
  children: React.ReactNode;
  title: string;
  onReset: () => void;
};

export default function Section({
  children,
  title,
  onReset,
}: SectionProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={styles.section + " " + (isOpen ? styles["section--open"] : "")}
    >
      <div className={styles.section__header}>
        <div className={styles.section__title}>{title}</div>
        <div className={styles.section__controls}>
          <div className={styles.section__reset} onClick={onReset}>
            <Icon id="reset" size={24} onClick={onReset} /> Reset
          </div>
          <Icon
            id={"chevron-big-up"}
            size={16}
            onClick={() => setIsOpen(!isOpen)}
            className={
              styles.section__icon +
              " " +
              (isOpen && styles[`section__icon--open`])
            }
            stroke="#2F2F2F"
          />
        </div>
      </div>
      <div
        className={
          styles.section__content +
          " " +
          (isOpen && styles[`section__content--open`])
        }
      >
        {children}
      </div>
    </div>
  );
}
