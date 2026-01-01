import { betterAuthClient } from '@/shared/lib/better-auth.client';

export function useSession() {
  const { data: session } = betterAuthClient.useSession();

  if (!session) {
    throw new Error('Session not found');
  }

  return session;
}
