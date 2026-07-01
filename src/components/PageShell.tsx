interface PageShellProps {
  children: React.ReactNode;
}

const BG_IMAGE = "/bg-site.png";

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="site-bg-photo pointer-events-none absolute inset-0 -z-20 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url("${BG_IMAGE}")` }}
      />
      <div className="site-bg-overlay pointer-events-none absolute inset-0 -z-10" />
      <div className="relative">{children}</div>
    </div>
  );
}
