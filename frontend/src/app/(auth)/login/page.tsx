import { AuthCard } from "@/components/auth-card";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Your tasks are waiting. Let's pick up where you left off."
      subtitle="Sign in to access your personal task board, track priorities, and stay on top of deadlines."
      alternateLabel="No account yet?"
      alternateHref="/register"
      alternateText="Register"
    >
      <LoginForm />
    </AuthCard>
  );
}
