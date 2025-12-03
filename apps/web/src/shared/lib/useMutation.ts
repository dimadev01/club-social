import { BetterFetchError } from '@better-fetch/fetch';
import { notifications } from '@mantine/notifications';
import {
  type DefaultError,
  type UseMutationOptions,
  useMutation as useTanstackMutation,
} from '@tanstack/react-query';

export function useMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
>(options: UseMutationOptions<TData, TError, TVariables>) {
  return useTanstackMutation({
    onError: (error) => {
      let message = 'Something went wrong';

      if (error instanceof BetterFetchError) {
        message = error.error.message ?? error.message;
      }

      notifications.show({ color: 'red', message });
    },
    ...options,
  });
}
