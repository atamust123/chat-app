import React from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { FormInput } from "./FormInput";
import { FormButton } from "./FormButton";
import { FormSelect } from "./FormSelect";

interface Form {
  children: React.ReactNode;
  formAttributes: UseFormReturn;
  onSubmit: () => any;
  id?: string;
  formProps?: Omit<
    React.DetailedHTMLProps<
      React.FormHTMLAttributes<HTMLFormElement>,
      HTMLFormElement
    >,
    "onSubmit" | "id"
  >;
}

/**
 * Wraps the html form to use context
 * @param props FormProvider requires all useForm (react hook form ) methods
 * @returns the wrapped form component.
 */
const Form: React.FC<Form> = (props) => {
  const { children, formAttributes, id, onSubmit, formProps } = props || {};
  return (
    <FormProvider {...formAttributes}>
      <form onSubmit={onSubmit} id={id} {...formProps}>
        {children}
      </form>
    </FormProvider>
  );
};
export default Object.assign(Form, {
  Input: FormInput,
  Button: FormButton,
  Select: FormSelect,
  // todo other UI components
});
