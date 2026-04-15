export type EmailVerificationFeedbackStatus = 'idle' | 'success' | 'error' | 'cooldown';

export interface VerificationSessionInfo {
  email: string | null;
  isVerified: boolean;
}

export interface ResendVerificationEmailResult {
  status: 'success' | 'error' | 'cooldown';
  message?: string;
  cooldownSeconds?: number;
}

export interface EmailVerificationFeedback {
  status: EmailVerificationFeedbackStatus;
  title: string;
  description: string;
  cooldownSeconds?: number;
}

export interface EmailVerificationCardProps {
  email: string | null;
  feedback: EmailVerificationFeedback;
  isResending: boolean;
  isExiting: boolean;
  canResend: boolean;
  onResend: () => Promise<void>;
  onExit: () => Promise<void>;
}