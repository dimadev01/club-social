import { Button, type ButtonProps } from 'antd';

export function FormSubmitButton(props: ButtonProps) {
  return <Button form="form" htmlType="submit" type="primary" {...props} />;
}
