import * as Select from "@radix-ui/react-select";
import { useEffect, useRef, useState } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  defaultValue?: string;
  id: string;
  label: string;
  name: string;
  options: SelectOption[];
};

export default function SelectField({
  defaultValue,
  id,
  label,
  name,
  options,
}: SelectFieldProps) {
  const initialValue = defaultValue ?? options[0]?.value ?? "";
  const [value, setValue] = useState(initialValue);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = fieldRef.current?.closest("form");
    const reset = () => setValue(initialValue);

    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [initialValue]);

  return (
    <div className="field select-field" ref={fieldRef}>
      <label htmlFor={id}>{label}</label>
      <Select.Root name={name} onValueChange={setValue} value={value}>
        <Select.Trigger className="select-field-trigger" id={id}>
          <Select.Value />
          <Select.Icon className="select-field-icon" aria-hidden="true">
            <span />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="select-field-content" position="popper">
            <Select.Viewport className="select-field-viewport">
              {options.map((option) => (
                <Select.Item
                  className="select-field-option"
                  key={option.value}
                  value={option.value}
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="select-field-indicator">
                    ✓
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
