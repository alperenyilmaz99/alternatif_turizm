interface PageShellProps {
  children: React.ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 site-bg-gradient" />
      <div className="pointer-events-none absolute -left-24 top-16 -z-10 h-80 w-80 rounded-full bg-teal-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/4 -z-10 h-96 w-96 rounded-full bg-sky-400/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-32 left-1/3 -z-10 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}
