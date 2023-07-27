import Button, { ButtonProps } from "../Button";

interface FormButton extends ButtonProps {}

export const FormButton: React.FC<FormButton> = (props) => {
  const { type, ...rest } = props || {};
  return <Button type="submit" {...rest} />;
};
