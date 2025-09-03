import styles from "./Field.module.scss";
import type { SelectOption } from "./SelectField";
import { useMemo, useState, type JSX } from "react";
import Checkbox from "./Checkbox";
import Icon from "@/components/ui/Icon/Icon";

type MultiSelectProps = {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
};

export default function MultiSelect({
  options,
  value,
  onChange,
}: MultiSelectProps): JSX.Element {
  const [query, setQuery] = useState("");

  const handleChange = (option: SelectOption) => {
    if (value.includes(option.value)) {
      onChange(value.filter((v) => v !== option.value));
    } else {
      onChange([...value, option.value]);
    }
  };

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  return (
    <div className={styles["multi-select"]}>
      <div
        className={styles.field__input + " " + styles["field__input--search"]}
      >
        <Icon id="search" size={20} />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className={styles["multi-select__options"]}>
        {filteredOptions.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            value={value.includes(option.value)}
            onChange={() => handleChange(option)}
          />
        ))}
      </div>
    </div>
  );
}
