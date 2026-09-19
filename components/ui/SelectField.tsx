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
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  value?: string;
};

export default function SelectField({
  defaultValue,
  id,
  label,
  name,
  onValueChange,
  options,
  value: controlledValue,
}: SelectFieldProps) {
  const initialValue = defaultValue ?? options[0]?.value ?? "";
  const [internalValue, setInternalValue] = useState(initialValue);
  const fieldRef = useRef<HTMLDivElement>(null);
  const value = controlledValue ?? internalValue;
  const isControlled = controlledValue !== undefined;

  useEffect(() => {
    const form = fieldRef.current?.closest("form");
    const reset = () => {
      if (!isControlled) setInternalValue(initialValue);
      onValueChange?.(initialValue);
    };

    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [initialValue, isControlled, onValueChange]);

  return (
    <div className="field select-field" ref={fieldRef}>
      <label htmlFor={id}>{label}</label>
      <Select.Root
        name={name}
        onValueChange={(nextValue) => {
          if (!isControlled) setInternalValue(nextValue);
          onValueChange?.(nextValue);
        }}
        value={value}
      >
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
