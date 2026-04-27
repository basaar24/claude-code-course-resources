import { AuthForm } from './AuthForm';

export default async function AuthenticatePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return <AuthForm mode={mode === 'register' ? 'register' : 'login'} />;
}
