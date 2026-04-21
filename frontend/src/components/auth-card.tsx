import Link from 'next/link';

export function AuthCard({
  eyebrow,
  title,
  subtitle,
  alternateLabel,
  alternateHref,
  alternateText,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  alternateLabel: string;
  alternateHref: string;
  alternateText: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 shadow-panel backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-ink px-10 py-12 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(244,201,93,0.28),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(217,119,87,0.45),_transparent_38%)]" />
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.3em] text-butter">{eyebrow}</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">{title}</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-white/75">{subtitle}</p>
          </div>
        </section>

        <section className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">
              TaskFlow
            </Link>
            <p className="text-sm text-ink/60">
              {alternateLabel}{' '}
              <Link href={alternateHref} className="font-semibold text-dusk">
                {alternateText}
              </Link>
            </p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
