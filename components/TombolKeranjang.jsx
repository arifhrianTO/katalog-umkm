"use client";

import { useState } from "react";
import { tambahKeKeranjang } from "@/lib/keranjang";

export default function TombolKeranjang({ produk, jumlah = 1, varian = "penuh" }) {
  const [sukses, setSukses] = useState(false);

  function handleTambah(e) {
    e.preventDefault();
    e.stopPropagation();
    tambahKeKeranjang(produk, jumlah);
    setSukses(true);
    setTimeout(() => setSukses(false), 2000);
  }

  if (varian === "ikon") {
    return (
      <button
        type="button"
        onClick={handleTambah}
        title={sukses ? "Ditambahkan ke keranjang!" : "Tambah ke keranjang"}
        aria-label="Tambah ke keranjang"
        className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition-colors ${
          sukses
            ? "border-utama bg-utama/10 text-utama"
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
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        <span>{sukses ? "Masuk!" : "+ Keranjang"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleTambah}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition-colors sm:w-auto ${
        sukses
          ? "border-utama bg-utama/10 text-utama"
          : "border-utama bg-latar text-utama hover:bg-utama hover:text-white"
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
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      <span>{sukses ? "✓ Masuk ke keranjang" : "+ Tambah ke keranjang"}</span>
    </button>
  );
}