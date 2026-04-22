"use client";

import { CustomSelect, SelectOption } from "@/components/ui/custom-select";

export function TaskFilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
}) {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      className="min-w-[170px]"
    />
  );
}
