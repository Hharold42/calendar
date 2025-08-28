import type { JSX } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

const variants = {
  primary: styles.primary,
  secondary: styles.secondary
};

const Button = ({ children, onClick, icon, className, variant = "primary" }: ButtonProps): JSX.Element => {

  return (
    <button className={`${styles.button} ${variants[variant]} ${className}`} onClick={onClick}>
      {icon}
      {children}
    </button>
  );
};

export default Button;
