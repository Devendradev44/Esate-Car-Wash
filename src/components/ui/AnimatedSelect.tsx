"use client";

import * as React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectScrollUpButton, SelectGroup } from "@/components/ui/select";
import { cn } from "cn";

interface AnimatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
}

export function AnimatedSelect(props: AnimatedSelectProps) {
  const { options, placeholder, className, label, error, onChange, value } = props;
    const initialValue = React.useMemo(() => {
      if (value === null || value === undefined) return null;
      if (typeof value === "string") return value;
      if (typeof value === "number") return String(value);
      if (Array.isArray(value)) return value[0] || null;
      return null;
    }, [value]);

    const [selectedValue, setSelectedValue] = React.useState<string | null>(initialValue);
    const [, setIsOpen] = React.useState(false);

    const handleValueChange = (newValue: string | null) => {
      setSelectedValue(newValue);
      if (newValue !== null) {
        onChange?.({ target: { value: newValue } } as React.ChangeEvent<HTMLSelectElement>);
      }
    };

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
    };

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label className="block text-xs font-bold uppercase tracking-machined text-muted mb-2">
            {label}
          </label>
        )}
        <Select onValueChange={handleValueChange} value={selectedValue} onOpenChange={handleOpenChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent sideOffset={4}>
            <SelectScrollUpButton />
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {error && (
          <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
        )}
      </div>
    );
}