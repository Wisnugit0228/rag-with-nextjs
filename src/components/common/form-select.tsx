"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

type Props<T extends Record<string, any>> = {
  form: UseFormReturn<T>;
  name: keyof T;
  label?: string;
  placeholder?: string;
  options: Option[];
};

export default function FormSelect<T extends Record<string, any>>({
  form,
  name,
  label,
  placeholder,
  options,
}: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}

          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder || "Select"} />
              </SelectTrigger>
            </FormControl>

            <SelectContent position="popper" className="z-[9999]">
              {options.length === 0 && (
                <SelectItem value="none" disabled>
                  No data
                </SelectItem>
              )}

              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
