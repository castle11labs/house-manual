"use client";

import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/Input";

interface ContactFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  prefix: Path<T>;
}

export function ContactFields<T extends FieldValues>({
  register,
  prefix,
}: ContactFieldsProps<T>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Input label="Name" {...register(`${prefix}.name` as Path<T>)} />
      <Input label="Company" {...register(`${prefix}.company` as Path<T>)} />
      <Input label="Phone" {...register(`${prefix}.phone` as Path<T>)} />
      <Input
        label="Email"
        type="email"
        {...register(`${prefix}.email` as Path<T>)}
      />
      <div className="sm:col-span-2">
        <Input label="Notes" {...register(`${prefix}.notes` as Path<T>)} />
      </div>
    </div>
  );
}
