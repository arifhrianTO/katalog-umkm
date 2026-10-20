"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import { ambilFavorit } from "@/lib/favorit";

export default function HalamanFavorit() {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  function muat() {
    setItems(ambilFavorit());
  }

  useEffect(() => {
    setMounted(true);
    muat();

    window.addEventListener("favorit-berubah", muat);
    return () => window.removeEventListener("favorit-berubah", muat);
  }, []);

  if (!mounted) {
    return (
      <div className="py-12">
        <h1 className="text-3xl font-extrabold">Produk Favorit</h1>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-2xl border border-garis bg-permukaan"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-8 sm:py-12">
      <div className="flex flex-col gap-1">
        <Link
          href="/"
          className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama self-start"
        >
          ← Kembali ke katalog
        </Link>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
          Produk Favorit Saya
        </h1>
        <p className="text-sm text-teks-lembut">
          Daftar produk yang telah Anda tandai sebagai favorit tersimpan di browser Anda.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-garis bg-permukaan p-12 text-center">
          <p className="text-lg font-bold text-teks">Belum ada produk favorit</p>
          <p className="max-w-md text-sm text-teks-lembut">
            Tekan ikon hati pada produk apa pun di katalog untuk menyimpannya di sini.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-utama px-5 py-2.5 font-semibold text-white hover:bg-utama-gelap"
          >
            Jelajahi Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {items.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}