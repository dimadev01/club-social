import { AuthUser } from '@supabase/supabase-js';
import { Request } from 'express';

export interface RequestWithUser<
  T extends AuthUser = AuthUser,
> extends Request {
  user: T;
}
