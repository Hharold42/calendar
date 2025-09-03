import type { JSX } from "react";
import styles from "./Field.module.scss";

type CheckboxProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
  disabled?: boolean;
};

export default function Checkbox({
  label,
  value,
  onChange,
  className,
  disabled = false,
}: CheckboxProps): JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  const handleContainerClick = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  return (
    <div 
      className={`${styles.checkbox} ${className || ""}`}
      onClick={handleContainerClick}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={handleChange}
        disabled={disabled}
        // id={`checkbox-${label.replace(/\s+/g, "-").toLowerCase()}`}
      />
      <label
        // htmlFor={`checkbox-${label.replace(/\s+/g, "-").toLowerCase()}`}
      >
        {label.split(" ")[0]}
      </label>
    </div>
  );
}
