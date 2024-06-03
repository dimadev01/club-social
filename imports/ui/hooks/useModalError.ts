import { App, ModalFuncProps } from 'antd';

export const useModalError = () => {
  const { modal } = App.useApp();

  return ({ ...rest }: ModalFuncProps) => modal.error({ width: 800, ...rest });
};
