interface HeaderProps {
  siteName?: string;
}

export default function Header({ siteName = "Alternatif Turizm Devremülk Merkezi" }: HeaderProps) {
  return (
    <header className="w-full py-10 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl md:text-5xl">
        {siteName}
      </h1>
      <p className="mt-3 text-base text-slate-500 sm:text-lg">
        Devremülk kiralama ve satış platformu
      </p>
    </header>
  );
}
