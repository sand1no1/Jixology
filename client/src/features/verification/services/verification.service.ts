import type { ResendVerificationEmailResult, VerificationSessionInfo } from '@/features/verification/types/verification.types';

export async function getVerificationSessionInfo(): Promise<VerificationSessionInfo> {
  return {
    email: null,
    isVerified: false,
  };
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function resendVerificationEmail(): Promise<ResendVerificationEmailResult> {
  await delay(5000);
  return {
    status: 'success',
    message: 'Te enviamos un nuevo correo de verificación.',
  };
}

export async function exitVerificationFlow(): Promise<void> {
  await delay(5000);
  return;
}