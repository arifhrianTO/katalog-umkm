"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  const kurangi = () => {
    setJumlah((prev) => Math.max(1, prev - 1));
  };

  const tambah = () => {
    setJumlah((prev) => prev + 1);
  };

  const totalHarga = (produk?.harga || 0) * jumlah;
  const nomor = (toko.nomorWhatsApp || "").replace(/\D/g, "");

  const pesan = `Halo, saya ingin memesan:\n\n*${produk?.nama || "Produk"}*\nJumlah: ${jumlah} item\nHarga satuan: ${formatRupiah(produk?.harga || 0)}\nTotal: ${formatRupiah(totalHarga)}\n\nApakah tersedia?`;
  const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-teks">Jumlah:</span>
        <div className="inline-flex items-center rounded-lg border border-garis bg-latar">
          <button
            type="button"
            onClick={kurangi}
            disabled={jumlah <= 1}
            aria-label="Kurangi jumlah"
            className="flex h-10 w-10 items-center justify-center text-lg font-bold text-teks transition-colors hover:bg-permukaan disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={jumlah}
            onChange={(e) => {
              const val = Number.parseInt(e.target.value, 10);
              setJumlah(Number.isNaN(val) || val < 1 ? 1 : val);
            }}
            aria-label="Jumlah pesanan"
            className="h-10 w-14 border-x border-garis bg-transparent text-center font-bold text-teks focus:outline-none"
          />
          <button
            type="button"
            onClick={tambah}
            aria-label="Tambah jumlah"
            className="flex h-10 w-10 items-center justify-center text-lg font-bold text-teks transition-colors hover:bg-permukaan"
          >
            +
          </button>
        </div>
        <span className="text-sm text-teks-lembut">
          Total: <strong className="font-bold text-harga">{formatRupiah(totalHarga)}</strong>
        </span>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap sm:w-auto"
      >
        Pesan via WhatsApp
      </a>
    </div>
  );
}