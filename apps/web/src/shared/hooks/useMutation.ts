import { BetterFetchError } from '@better-fetch/fetch';
import {
  type DefaultError,
  type UseMutationOptions,
  useMutation as useTanstackMutation,
} from '@tanstack/react-query';
import { App } from 'antd';

export function useMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
>(options: UseMutationOptions<TData, TError, TVariables>) {
  const { message: messageApi } = App.useApp();

  return useTanstackMutation({
    onError: (error) => {
      let message = 'Something went wrong';

      if (error instanceof BetterFetchError) {
        message = error.error.message ?? error.message;
      }

      messageApi.error(message);
    },
    ...options,
  });
}
