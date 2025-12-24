import type { ReactNode } from 'react';

import { Form as AntForm, type FormProps as AntFormProps } from 'antd';

type FormProps<T> = Omit<AntFormProps<T>, 'children'> & {
  children?: ReactNode;
};

export function Form<T>(props: FormProps<T>) {
  return (
    <AntForm
      autoComplete="off"
      layout="vertical"
      scrollToFirstError
      {...props}
    />
  );
}

Form.Item = AntForm.Item;
Form.useForm = AntForm.useForm;
Form.useWatch = AntForm.useWatch;
Form.List = AntForm.List;
