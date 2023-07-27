import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { ControllerRenderProps, FieldErrors } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  errors: FieldErrors;
  disabled?: boolean;
  formMethods: ControllerRenderProps;
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}

const Input: React.FC<InputProps> = (props) => {
  const {
    label,
    id,
    errors,
    type = "text",
    disabled,
    required,
    formMethods,
    inputProps,
  } = props || {};
  return (
    <div>
      <label
        htmlFor={id}
        className="
          block 
          text-sm 
          font-medium 
          leading-6 
          text-gray-900
        "
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          required={required}
          {...formMethods}
          className={clsx(
            `
            form-input
            block 
            w-full 
            rounded-md 
            border-0 
            py-1.5 
            text-gray-900 
            shadow-sm 
            ring-1 
            ring-inset 
            ring-gray-300 
            placeholder:text-gray-400 
            focus:ring-2 
            focus:ring-inset 
            focus:ring-sky-600 
            sm:text-sm 
            sm:leading-6`,
            errors[id] && "focus:ring-rose-500",
            disabled && "opacity-50 cursor-default"
          )}
          {...inputProps}
        />
      </div>
    </div>
  );
};

export default Input;
