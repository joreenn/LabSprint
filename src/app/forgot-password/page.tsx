import type { Metadata } from 'next';
import { AuthScreen } from '@/components/reviewer/auth-screen';

export const metadata: Metadata = {
  title: 'Recover your account · LabSprint',
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return <AuthScreen initialMode="recover" />;
}
