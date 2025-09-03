import type { JSX } from "react";
import styles from "./Button.module.scss";
import { memo } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

const variants = {
  primary: styles.primary,
  secondary: styles.secondary
};

const Button = memo(({ children, onClick, icon, className, variant = "primary", disabled = false }: ButtonProps): JSX.Element => {

  return (
    <button 
      className={`${styles.button} ${variants[variant]} ${className}`} 
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
});

export default Button;
