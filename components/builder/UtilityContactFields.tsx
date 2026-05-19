"use client";

import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/Input";

interface UtilityContactFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  prefix: Path<T>;
  title: string;
}

export function UtilityContactFields<T extends FieldValues>({
  register,
  prefix,
  title,
}: UtilityContactFieldsProps<T>) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-text-primary">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Provider"
          {...register(`${prefix}.provider` as Path<T>)}
        />
        <Input
          label="Account Number"
          {...register(`${prefix}.accountNumber` as Path<T>)}
        />
        <Input
          label="Phone"
          {...register(`${prefix}.phone` as Path<T>)}
        />
        <Input
          label="Website"
          {...register(`${prefix}.website` as Path<T>)}
        />
      </div>
      <Input
        label="Notes"
        {...register(`${prefix}.notes` as Path<T>)}
      />
    </div>
  );
}
