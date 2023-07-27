import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "../Input";

interface FormInput {
  loading: boolean;
  name: string;
  label: string;
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}

/**
 * Can not be used without "form" because Uses "context"
 * @param props input attributes that defines label, name, disabled features
 * @returns Input components
 */
export const FormInput: React.FC<FormInput> = (props) => {
  const { loading, name, label = "Boş", inputProps } = props || {};
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ formState: { errors }, field }) => (
        <Input
          disabled={loading}
          errors={errors}
          id={name}
          label={label}
          formMethods={field}
          inputProps={inputProps}
        />
      )}
    />
  );
};
