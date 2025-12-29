import type { UseMutationOptions } from '@tanstack/react-query';

import { App } from 'antd';

import { $fetch } from '../lib/fetch';
import { useMutation } from './useMutation';

interface Props<
  TData = unknown,
  TError = Error,
  TVariables = void,
> extends UseMutationOptions<TData, TError, TVariables> {
  endpoint: string;
  successMessage: string;
}

export function useVoidMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
>({
  endpoint,
  onSuccess,
  successMessage,
  ...props
}: Props<TData, TError, TVariables>) {
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (body) => $fetch(endpoint, { body, method: 'PATCH' }),
    onSuccess: (data, variables, onMutate, context) => {
      message.success(successMessage);
      onSuccess?.(data, variables, onMutate, context);
    },
    ...props,
  });
}
