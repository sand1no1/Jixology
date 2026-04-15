import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exitVerificationFlow, getVerificationSessionInfo, resendVerificationEmail } from '@/features/verification/services/verification.service';
import type { EmailVerificationFeedback, ResendVerificationEmailResult } from '@/features/verification/types/verification.types';

const LOGIN_PATH = '/inicio-sesion';

function buildFeedback(result: ResendVerificationEmailResult): EmailVerificationFeedback {
  if (result.status === 'success') {
    return {
      status: 'success',
      title: 'Correo reenviado',
      description:
        result.message ??
        'Te enviamos un nuevo correo de verificación. Revisa tu bandeja de entrada y también spam o correos no deseados.',
    };
  }

  if (result.status === 'cooldown') {
    return {
      status: 'cooldown',
      title: 'Espera antes de reenviar',
      description:
        result.message ??
        'Ya se solicitó un correo recientemente. Intenta de nuevo cuando termine el tiempo de espera.',
      cooldownSeconds: result.cooldownSeconds,
    };
  }

  return {
    status: 'error',
    title: 'No se pudo reenviar el correo',
    description:
      result.message ??
      'Ocurrió un problema al reenviar el correo de verificación. Intenta de nuevo en unos momentos.',
  };
}

export function useEmailVerificationScreen() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<EmailVerificationFeedback>({ status: 'idle', title: '', description: '' });
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [cooldownRemainingSeconds, setCooldownRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSessionInfo = async () => {
      const sessionInfo = await getVerificationSessionInfo();

      if (!isMounted) {
        return;
      }

      setEmail(sessionInfo.email);
    };

    loadSessionInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (cooldownRemainingSeconds === null || cooldownRemainingSeconds <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCooldownRemainingSeconds((currentValue) => {
        if (currentValue === null) {
          return null;
        }

        if (currentValue <= 1) {
          window.clearInterval(intervalId);
          return null;
        }

        return currentValue - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [cooldownRemainingSeconds]);

  useEffect(() => {
    if (cooldownRemainingSeconds !== null && cooldownRemainingSeconds > 0) {
      setFeedback({
        status: 'cooldown',
        title: 'Espera antes de reenviar',
        description: 'Ya se solicitó un correo recientemente. Intenta de nuevo cuando termine el tiempo de espera.',
        cooldownSeconds: cooldownRemainingSeconds,
      });
      return;
    }

    if (feedback.status === 'cooldown') {
      setFeedback({
        status: 'idle',
        title: '',
        description: '',
      });
    }
  }, [cooldownRemainingSeconds, feedback.status]);

  const handleResend = async () => {
    if (isResending || cooldownRemainingSeconds !== null) {
      return;
    }

    setIsResending(true);

    try {
      const result = await resendVerificationEmail();
      const nextFeedback = buildFeedback(result);

      setFeedback(nextFeedback);

      if (result.status === 'cooldown' && typeof result.cooldownSeconds === 'number' && result.cooldownSeconds > 0) {
        setCooldownRemainingSeconds(result.cooldownSeconds);
      }
    } catch {
      setFeedback({
        status: 'error',
        title: 'No se pudo reenviar el correo',
        description:
          'Ocurrió un problema al reenviar el correo de verificación. Intenta de nuevo en unos momentos.',
      });
    } finally {
      setIsResending(false);
    }
  }

  const handleExit = async () => {
    if (isExiting) {
      return;
    }

    setIsExiting(true);

    try {
      await exitVerificationFlow();
    } finally {
      navigate(LOGIN_PATH, { replace: true });
      setIsExiting(false);
    }
  };

  const canResend = !isResending && cooldownRemainingSeconds === null;

  return {
    email,
    feedback,
    isResending,
    isExiting,
    canResend,
    handleResend,
    handleExit,
  };
}