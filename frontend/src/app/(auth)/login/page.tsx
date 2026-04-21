import { AuthRedirect } from '@/components/auth-redirect';
import { AuthCard } from '@/components/auth-card';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <AuthRedirect mode="guest-only">
      <AuthCard
        eyebrow="Welcome Back"
        title="Sign in and pick up exactly where you left off."
        subtitle="Use your email and password to access your personal task dashboard."
        alternateLabel="Need an account?"
        alternateHref="/register"
        alternateText="Register"
      >
        <LoginForm />
      </AuthCard>
    </AuthRedirect>
  );
}
