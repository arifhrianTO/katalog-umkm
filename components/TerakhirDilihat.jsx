"use client";

import { useEffect, useState } from "react";
import KartuProduk from "@/components/KartuProduk";
import { ambilRiwayat } from "@/lib/riwayat";

export default function TerakhirDilihat() {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  function muat() {
    setItems(ambilRiwayat());
  }

  useEffect(() => {
    setMounted(true);
    muat();

    window.addEventListener("riwayat-berubah", muat);
    return () => window.removeEventListener("riwayat-berubah", muat);
  }, []);

  if (!mounted || items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="judul-terakhir-dilihat" className="flex flex-col gap-5 pt-8 border-t border-garis">
      <div className="flex items-center justify-between">
        <h2 id="judul-terakhir-dilihat" className="text-xl font-bold">
          Terakhir Dilihat
        </h2>
        <span className="text-xs text-teks-lembut">
          Disimpan otomatis di perangkat Anda
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {items.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </section>
  );
}