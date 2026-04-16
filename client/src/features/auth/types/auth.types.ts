import type { Session, User } from '@supabase/supabase-js';

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResult {
  session: Session;
  user: User;
}