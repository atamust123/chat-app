import Select, { type Select as SelectPros } from "@/app/components/Select";
import { Controller, useFormContext } from "react-hook-form";

interface FormSelect extends Omit<SelectPros, "value" | "onChange"> {
  name: string;
}

export const FormSelect: React.FC<FormSelect> = (props) => {
  const { name, ...rest } = props || {};
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={""}
      render={({ field }) => <Select {...rest} {...field} />}
    />
  );
};
