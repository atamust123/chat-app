import Button, { ButtonProps } from "../../../components/Button";

interface FormButton extends ButtonProps {}

export const FormButton: React.FC<FormButton> = (props) => {
  const { type, ...rest } = props || {};
  return <Button type="submit" {...rest} />;
};
