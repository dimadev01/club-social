import { Button, type ButtonProps } from 'antd';

export function FormSubmitButtonAndBack(props: ButtonProps) {
  return (
    <Button form="form" htmlType="submit" type="default" {...props}>
      Crear y volver
    </Button>
  );
}
