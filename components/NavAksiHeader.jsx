"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TombolTema from "@/components/TombolTema";
import { ambilKeranjang, hitungTotalKeranjang } from "@/lib/keranjang";
import { ambilFavorit } from "@/lib/favorit";
import { ambilBandingkan } from "@/lib/bandingkan";

export default function NavAksiHeader() {
  const [totalKeranjang, setTotalKeranjang] = useState(0);
  const [totalFavorit, setTotalFavorit] = useState(0);
  const [totalBandingkan, setTotalBandingkan] = useState(0);
  const [mounted, setMounted] = useState(false);

  function muatData() {
    setTotalKeranjang(hitungTotalKeranjang(ambilKeranjang()).totalItem);
    setTotalFavorit(ambilFavorit().length);
    setTotalBandingkan(ambilBandingkan().length);
  }

  useEffect(() => {
    setMounted(true);
    muatData();

    window.addEventListener("keranjang-berubah", muatData);
    window.addEventListener("favorit-berubah", muatData);
    window.addEventListener("bandingkan-berubah", muatData);

    return () => {
      window.removeEventListener("keranjang-berubah", muatData);
      window.removeEventListener("favorit-berubah", muatData);
      window.removeEventListener("bandingkan-berubah", muatData);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Tombol Favorit */}
      <Link
        href="/favorit"
        aria-label="Lihat produk favorit"
        title="Favorit"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-teks transition-colors hover:border-utama hover:text-utama"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        {mounted && totalFavorit > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-bahaya px-1 text-[10px] font-bold text-white">
            {totalFavorit}
          </span>
        )}
      </Link>

      {/* Tombol Bandingkan */}
      <Link
        href="/bandingkan"
        aria-label="Bandingkan produk"
        title="Bandingkan produk"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-teks transition-colors hover:border-utama hover:text-utama"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m16 3 4 4-4 4" />
          <path d="M20 7H4" />
          <path d="m8 21-4-4 4-4" />
          <path d="M4 17h16" />
        </svg>
        {mounted && totalBandingkan > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-utama px-1 text-[10px] font-bold text-white">
            {totalBandingkan}
          </span>
        )}
      </Link>

      {/* Tombol Keranjang */}
      <Link
        href="/keranjang"
        aria-label="Lihat keranjang belanja"
        title="Keranjang"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-teks transition-colors hover:border-utama hover:text-utama"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        {mounted && totalKeranjang > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-harga px-1 text-[10px] font-bold text-white">
            {totalKeranjang}
          </span>
        )}
      </Link>

      {/* Tombol Mode Gelap/Terang */}
      <TombolTema />
    </div>
  );
}