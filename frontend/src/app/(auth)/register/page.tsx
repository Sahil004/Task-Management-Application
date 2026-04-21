import { AuthCard } from '@/components/auth-card';
import { RegisterForm } from '@/components/register-form';

export default function RegisterPage() {
  return (
    <AuthCard
      eyebrow="Create Account"
      title="Build a task system that feels simple from day one."
      subtitle="Create your account, connect to the backend, and start managing tasks immediately."
      alternateLabel="Already have an account?"
      alternateHref="/login"
      alternateText="Login"
    >
      <RegisterForm />
    </AuthCard>
  );
}
