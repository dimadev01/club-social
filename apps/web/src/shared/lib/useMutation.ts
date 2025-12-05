import { BetterFetchError } from '@better-fetch/fetch';
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

      console.error(message);
    },
    ...options,
  });
}
