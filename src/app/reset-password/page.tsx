import type { Metadata } from 'next';
import { ResetPassword } from '@/components/reviewer/reset-password';

export const metadata: Metadata = {
  title: 'Choose a new password · LabSprint',
  robots: { index: false },
  referrer: 'no-referrer',
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = typeof params.token === 'string' && params.token.length <= 200 ? params.token : '';
  return <ResetPassword token={token} invalid={Boolean(params.error) || !token} />;
}
