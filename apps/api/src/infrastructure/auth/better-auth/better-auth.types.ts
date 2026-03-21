import type { UserWithRole } from 'better-auth/plugins';

import type { auth } from './better-auth.service';

export type AuthSession = Omit<InferredSession, 'user'> & {
  memberId?: string;
  user: UserWithRole;
};

type InferredSession = typeof auth.$Infer.Session;
