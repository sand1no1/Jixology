import EmailVerificationCard from '@/features/verification/components/EmailVerificationCard';
import { useEmailVerificationScreen } from '@/features/verification/hooks/useEmailVerificationScreen';
import AuthCardLayout from '@/shared/components/AuthCardLayout';
import './EmailVerificationPage.css';

export default function EmailVerificationPage() {
  const {
    email,
    feedback,
    isResending,
    isExiting,
    canResend,
    handleResend,
    handleExit,
  } = useEmailVerificationScreen();

  return (
    <AuthCardLayout>
      <div className="email-verification-page">
        <EmailVerificationCard
          email={email}
          feedback={feedback}
          isResending={isResending}
          isExiting={isExiting}
          canResend={canResend}
          onResend={handleResend}
          onExit={handleExit}
        />
      </div>
    </AuthCardLayout>
  );
}