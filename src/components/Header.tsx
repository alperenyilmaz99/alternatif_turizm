import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full py-8 text-center sm:py-10">
      <Link href="/" className="inline-block transition hover:opacity-90">
        <Image
          src="/logo.png"
          alt="Alternatif Turizm Devremülk Merkezi"
          width={941}
          height={604}
          priority
          className="mx-auto h-auto w-[min(100%,320px)] bg-transparent sm:w-[min(100%,380px)] md:w-[420px]"
        />
      </Link>
      <p className="mt-4 text-base text-teal-800/80 sm:mt-5 sm:text-lg">
        Devremülk Kiralama & Satış Platformu
      </p>
    </header>
  );
}
