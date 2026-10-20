import Link from "next/link";
import NavAksiHeader from "@/components/NavAksiHeader";
import { toko } from "@/lib/toko";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-garis bg-latar/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-utama">
            {toko.nama}
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold sm:flex">
            <Link href="/" className="text-teks hover:text-utama">
              Katalog
            </Link>
            <Link href="/tentang" className="text-teks hover:text-utama">
              Tentang
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <NavAksiHeader />
        </div>
      </div>
    </header>
  );
}