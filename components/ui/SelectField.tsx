import * as Select from "@radix-ui/react-select";
import { useEffect, useRef, useState } from "react";

type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SelectFieldProps = {
  className?: string;
  defaultValue?: string;
  id: string;
  label: string;
  name: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  value?: string;
};

export default function SelectField({
  className,
  defaultValue,
  id,
  label,
  name,
  onValueChange,
  options,
  placeholder,
  required,
  value: controlledValue,
}: SelectFieldProps) {
  const initialValue = defaultValue ?? (placeholder ? undefined : options[0]?.value ?? "");
  const [internalValue, setInternalValue] = useState(initialValue);
  const fieldRef = useRef<HTMLDivElement>(null);
  const value = controlledValue ?? internalValue;
  const isControlled = controlledValue !== undefined;

  useEffect(() => {
    const form = fieldRef.current?.closest("form");
    const reset = () => {
      if (!isControlled) setInternalValue(initialValue);
      if (initialValue !== undefined) onValueChange?.(initialValue);
    };

    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [initialValue, isControlled, onValueChange]);

  return (
    <div className={["field", "select-field", className].filter(Boolean).join(" ")} ref={fieldRef}>
      <label htmlFor={id}>{label}</label>
      <Select.Root
        name={name}
        onValueChange={(nextValue) => {
          if (!isControlled) setInternalValue(nextValue);
          onValueChange?.(nextValue);
        }}
        required={required}
        value={value}
      >
        <Select.Trigger className="select-field-trigger" id={id}>
          <Select.Value placeholder={placeholder} />
          <Select.Icon className="select-field-icon" aria-hidden="true">
            <span />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className={[
              "select-field-content",
              `select-field-content-${name}`,
            ].join(" ")}
            position="popper"
          >
            <Select.Viewport className="select-field-viewport">
              {options.map((option) => (
                <Select.Item
                  className="select-field-option"
                  disabled={option.disabled}
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
