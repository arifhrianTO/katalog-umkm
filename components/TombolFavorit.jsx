"use client";

import { useEffect, useState } from "react";
import { cekFavorit, toggleFavorit } from "@/lib/favorit";

export default function TombolFavorit({ produk, ukuran = "standar" }) {
  const [aktif, setAktif] = useState(false);
  const [mounted, setMounted] = useState(false);

  function sync() {
    if (produk?.id) {
      setAktif(cekFavorit(produk.id));
    }
  }

  useEffect(() => {
    setMounted(true);
    sync();

    window.addEventListener("favorit-berubah", sync);
    return () => window.removeEventListener("favorit-berubah", sync);
  }, [produk?.id]);

  function handleToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    const status = toggleFavorit(produk);
    setAktif(status);
  }

  const kelas =
    ukuran === "kecil"
      ? "flex h-8 w-8 items-center justify-center rounded-full bg-latar/80 backdrop-blur-sm border border-garis text-teks hover:border-bahaya hover:text-bahaya transition-colors"
      : "inline-flex items-center gap-2 rounded-lg border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-teks hover:border-bahaya hover:text-bahaya transition-colors";

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-label="Tandai favorit"
        className={kelas}
      >
        <span className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={aktif ? "Hapus dari favorit" : "Tambah ke favorit"}
      title={aktif ? "Hapus dari favorit" : "Tambah ke favorit"}
      className={`${kelas} ${aktif ? "!border-bahaya !text-bahaya" : ""}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ukuran === "kecil" ? 16 : 18}
        height={ukuran === "kecil" ? 16 : 18}
        viewBox="0 0 24 24"
        fill={aktif ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      {ukuran !== "kecil" && (
        <span>{aktif ? "Tersimpan di Favorit" : "Simpan ke Favorit"}</span>
      )}
    </button>
  );
}