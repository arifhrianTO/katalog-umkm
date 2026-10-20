"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ambilKeranjang,
  ubahJumlahKeranjang,
  hapusDariKeranjang,
  kosongkanKeranjang,
  hitungTotalKeranjang,
} from "@/lib/keranjang";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

export default function HalamanKeranjang() {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  function muat() {
    setItems(ambilKeranjang());
  }

  useEffect(() => {
    setMounted(true);
    muat();

    window.addEventListener("keranjang-berubah", muat);
    return () => window.removeEventListener("keranjang-berubah", muat);
  }, []);

  if (!mounted) {
    return (
      <div className="py-12">
        <h1 className="text-3xl font-extrabold">Keranjang Belanja</h1>
        <div className="mt-6 h-40 animate-pulse rounded-2xl border border-garis bg-permukaan" />
      </div>
    );
  }

  const { totalItem, totalHarga } = hitungTotalKeranjang(items);
  const nomor = (toko.nomorWhatsApp || "").replace(/\D/g, "");

  // Susun teks pesan WhatsApp gabungan
  const daftarTeks = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.nama}* (x${item.jumlah}) - ${formatRupiah(
          (item.harga || 0) * item.jumlah
        )}`
    )
    .join("\n");

  const pesanWhatsApp = `Halo ${toko.nama}, saya ingin memesan beberapa produk sekaligus:\n\n${daftarTeks}\n\n*Total Item:* ${totalItem} barang\n*Total Pembayaran:* ${formatRupiah(
    totalHarga
  )}\n\nApakah semua pesanan ini tersedia?`;

  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(pesanWhatsApp)}`;

  return (
    <div className="flex flex-col gap-8 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            Keranjang Belanja
          </h1>
          <p className="mt-1 text-sm text-teks-lembut">
            Pesan seluruh produk pilihan Anda dalam satu pesan WhatsApp.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={kosongkanKeranjang}
            className="text-sm font-semibold text-bahaya hover:underline"
          >
            Kosongkan keranjang
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-garis bg-permukaan p-12 text-center">
          <p className="text-lg font-bold text-teks">Keranjang belanja Anda masih kosong</p>
          <p className="max-w-md text-sm text-teks-lembut">
            Pilih produk yang Anda sukai dari katalog kami, lalu tambahkan ke keranjang untuk memesan
            sekaligus.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-utama px-5 py-2.5 font-semibold text-white hover:bg-utama-gelap"
          >
            Lihat Katalog Produk
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Daftar Produk di Keranjang */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-garis bg-latar p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.foto_url}
                    alt={item.nama}
                    className="h-20 w-20 rounded-xl bg-permukaan object-cover"
                  />
                  <div>
                    <span className="text-xs text-teks-lembut">{item.kategori}</span>
                    <Link
                      href={`/produk/${item.id}`}
                      className="line-clamp-1 font-semibold hover:text-utama text-teks"
                    >
                      {item.nama}
                    </Link>
                    <p className="text-sm font-bold text-harga">
                      {formatRupiah(item.harga)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-garis">
                  {/* Kontrol Jumlah */}
                  <div className="inline-flex items-center rounded-lg border border-garis bg-latar">
                    <button
                      type="button"
                      onClick={() => ubahJumlahKeranjang(item.id, item.jumlah - 1)}
                      className="flex h-8 w-8 items-center justify-center font-bold text-teks hover:bg-permukaan"
                      aria-label="Kurangi jumlah"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-teks">
                      {item.jumlah}
                    </span>
                    <button
                      type="button"
                      onClick={() => ubahJumlahKeranjang(item.id, item.jumlah + 1)}
                      className="flex h-8 w-8 items-center justify-center font-bold text-teks hover:bg-permukaan"
                      aria-label="Tambah jumlah"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal Item */}
                  <div className="w-24 text-right">
                    <span className="text-xs text-teks-lembut sm:hidden block">Subtotal:</span>
                    <span className="font-bold text-sm text-teks">
                      {formatRupiah((item.harga || 0) * item.jumlah)}
                    </span>
                  </div>

                  {/* Tombol Hapus */}
                  <button
                    type="button"
                    onClick={() => hapusDariKeranjang(item.id)}
                    aria-label={`Hapus ${item.nama}`}
                    className="text-teks-lembut hover:text-bahaya p-1"
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
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan & Tombol Pesan WhatsApp */}
          <div className="flex flex-col gap-4 rounded-2xl border border-garis bg-permukaan p-6 h-fit sticky top-20">
            <h2 className="text-lg font-bold text-teks">Ringkasan Pesanan</h2>

            <div className="flex flex-col gap-2 border-b border-garis pb-4 text-sm">
              <div className="flex justify-between text-teks-lembut">
                <span>Total barang:</span>
                <span className="font-semibold text-teks">{totalItem} item</span>
              </div>
              <div className="flex justify-between text-teks-lembut">
                <span>Total harga:</span>
                <span className="font-bold text-lg text-harga">
                  {formatRupiah(totalHarga)}
                </span>
              </div>
            </div>

            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3.5 font-bold text-white transition-colors hover:bg-utama-gelap text-center shadow-sm"
            >
              Pesan Semua via WhatsApp
            </a>

            <Link
              href="/"
              className="text-center text-sm font-semibold text-teks-lembut hover:text-utama underline underline-offset-4"
            >
              Lanjut pilih produk lain
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}