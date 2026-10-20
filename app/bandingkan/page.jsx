"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ambilBandingkan,
  hapusBandingkan,
  kosongkanBandingkan,
} from "@/lib/bandingkan";
import TombolKeranjang from "@/components/TombolKeranjang";
import { formatRupiah } from "@/lib/format";

export default function HalamanBandingkan() {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  function muat() {
    setItems(ambilBandingkan());
  }

  useEffect(() => {
    setMounted(true);
    muat();

    window.addEventListener("bandingkan-berubah", muat);
    return () => window.removeEventListener("bandingkan-berubah", muat);
  }, []);

  if (!mounted) {
    return (
      <div className="py-12">
        <h1 className="text-3xl font-extrabold">Bandingkan Produk</h1>
        <div className="mt-6 h-60 animate-pulse rounded-2xl border border-garis bg-permukaan" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/"
            className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama self-start"
          >
            ← Kembali ke katalog
          </Link>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            Perbandingan Produk
          </h1>
          <p className="text-sm text-teks-lembut">
            Bandingkan detail dan spesifikasi hingga 2 produk secara berdampingan.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={kosongkanBandingkan}
            className="text-sm font-semibold text-bahaya hover:underline"
          >
            Bersihkan perbandingan
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-garis bg-permukaan p-12 text-center">
          <p className="text-lg font-bold text-teks">Belum ada produk yang dibandingkan</p>
          <p className="max-w-md text-sm text-teks-lembut">
            Pilih tombol "Bandingkan" pada kartu produk di katalog untuk melihat perbandingan
            spesifikasi berdampingan.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-utama px-5 py-2.5 font-semibold text-white hover:bg-utama-gelap"
          >
            Pilih Produk di Katalog
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {items.length === 1 && (
            <div className="rounded-xl border border-garis bg-harga-latar/40 p-4 text-sm text-teks flex items-center justify-between gap-4">
              <span>
                Baru 1 produk dipilih. Silakan pilih <strong>1 produk lagi</strong> di katalog untuk
                dibandingkan berdampingan.
              </span>
              <Link
                href="/"
                className="shrink-0 font-bold text-utama underline underline-offset-4"
              >
                Cari Produk Lain →
              </Link>
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-garis bg-latar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-garis bg-permukaan">
                  <th className="w-32 sm:w-44 p-4 font-semibold text-teks-lembut">
                    Atribut
                  </th>
                  {items.map((p) => (
                    <th key={p.id} className="p-4 font-bold text-base text-teks min-w-[200px]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="line-clamp-1">{p.nama}</span>
                        <button
                          type="button"
                          onClick={() => hapusBandingkan(p.id)}
                          className="text-xs text-bahaya hover:underline font-normal"
                        >
                          Hapus
                        </button>
                      </div>
                    </th>
                  ))}
                  {items.length === 1 && (
                    <th className="p-4 text-teks-lembut min-w-[200px] border-l border-dashed border-garis bg-permukaan/30">
                      Slot Produk ke-2
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-garis">
                {/* Foto */}
                <tr>
                  <td className="p-4 font-semibold text-teks-lembut">Foto</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4">
                      <img
                        src={p.foto_url}
                        alt={p.nama}
                        className="h-32 w-32 rounded-xl object-cover bg-permukaan border border-garis"
                      />
                    </td>
                  ))}
                  {items.length === 1 && (
                    <td className="p-4 text-center border-l border-dashed border-garis">
                      <Link
                        href="/"
                        className="inline-flex h-32 w-32 items-center justify-center rounded-xl border border-dashed border-garis text-sm text-teks-lembut hover:border-utama hover:text-utama"
                      >
                        + Tambah
                      </Link>
                    </td>
                  )}
                </tr>

                {/* Kategori */}
                <tr>
                  <td className="p-4 font-semibold text-teks-lembut">Kategori</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-teks font-medium">
                      {p.kategori || "-"}
                    </td>
                  ))}
                  {items.length === 1 && <td className="p-4 border-l border-dashed border-garis">-</td>}
                </tr>

                {/* Harga */}
                <tr>
                  <td className="p-4 font-semibold text-teks-lembut">Harga</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4">
                      <span className="rounded-md bg-harga-latar px-2.5 py-1 text-base font-bold text-harga">
                        {formatRupiah(p.harga)}
                      </span>
                    </td>
                  ))}
                  {items.length === 1 && <td className="p-4 border-l border-dashed border-garis">-</td>}
                </tr>

                {/* Deskripsi */}
                <tr>
                  <td className="p-4 font-semibold text-teks-lembut align-top">Deskripsi</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-teks leading-relaxed align-top">
                      {p.deskripsi || "Tidak ada deskripsi."}
                    </td>
                  ))}
                  {items.length === 1 && <td className="p-4 border-l border-dashed border-garis">-</td>}
                </tr>

                {/* Aksi */}
                <tr>
                  <td className="p-4 font-semibold text-teks-lembut">Aksi</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4">
                      <div className="flex flex-col gap-2">
                        <TombolKeranjang produk={p} varian="penuh" />
                        <Link
                          href={`/produk/${p.id}`}
                          className="text-xs font-semibold text-teks-lembut hover:text-utama underline"
                        >
                          Lihat detail produk →
                        </Link>
                      </div>
                    </td>
                  ))}
                  {items.length === 1 && <td className="p-4 border-l border-dashed border-garis">-</td>}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}