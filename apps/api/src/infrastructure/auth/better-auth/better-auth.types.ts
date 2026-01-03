import type { auth } from './better-auth.service';

export type AuthSession = typeof auth.$Infer.Session & {
  memberId?: string;
};
