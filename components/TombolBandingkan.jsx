"use client";

import { useEffect, useState } from "react";
import { cekBandingkan, toggleBandingkan } from "@/lib/bandingkan";

export default function TombolBandingkan({ produk, varian = "penuh" }) {
  const [aktif, setAktif] = useState(false);
  const [pesan, setPesan] = useState("");
  const [mounted, setMounted] = useState(false);

  function sync() {
    if (produk?.id) {
      setAktif(cekBandingkan(produk.id));
    }
  }

  useEffect(() => {
    setMounted(true);
    sync();

    window.addEventListener("bandingkan-berubah", sync);
    return () => window.removeEventListener("bandingkan-berubah", sync);
  }, [produk?.id]);

  function handleToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    const hasil = toggleBandingkan(produk);
    setAktif(hasil.status !== "dihapus");
    if (hasil.pesan) {
      setPesan(hasil.pesan);
      setTimeout(() => setPesan(""), 3000);
    }
  }

  if (varian === "ikon") {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          title={aktif ? "Hapus dari perbandingan" : "Bandingkan produk"}
          aria-label="Bandingkan produk"
          className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-colors ${
            aktif
              ? "border-utama bg-utama text-white"
              : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
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
        </button>
        {pesan && (
          <div className="absolute bottom-full right-0 mb-2 z-20 w-44 rounded-lg border border-garis bg-latar p-2 text-xs shadow-lg text-teks">
            {pesan}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-flex flex-col">
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors sm:w-auto ${
          aktif
            ? "border-utama bg-utama text-white"
            : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
        }`}
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
        <span>{aktif ? "Dipilih untuk dibanding" : "Bandingkan produk"}</span>
      </button>
      {pesan && (
        <span className="mt-1 text-xs text-utama font-medium">{pesan}</span>
      )}
    </div>
  );
}