import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-dim px-6 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 block text-center font-display text-2xl font-bold text-ink"
        >
          OS<span className="text-amber-dark">Fácil</span>
        </Link>
        <div className="rounded-2xl border border-line bg-paper p-7 shadow-[0_20px_50px_-25px_rgba(28,27,26,0.35)]">
          <h1 className="font-display text-2xl font-semibold text-ink">
            {title}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
          {children}
        </div>
      </div>
    </main>
  );
}
