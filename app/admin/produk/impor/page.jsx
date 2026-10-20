"use client";

import { useActionState } from "react";
import Link from "next/link";
import NavAdmin from "@/components/NavAdmin";
import Tombol from "@/components/Tombol";
import { imporProdukCsv } from "@/app/admin/actions";

export default function HalamanImporProduk() {
  const [state, formAction, pending] = useActionState(imporProdukCsv, null);

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      <div className="flex flex-col gap-1">
        <Link
          href="/admin"
          className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama self-start"
        >
          ← Kembali ke daftar produk
        </Link>
        <h1 className="text-2xl font-extrabold">Impor Produk dari CSV</h1>
        <p className="text-sm text-teks-lembut">
          Tambahkan banyak produk sekaligus dengan mengunggah file spreadsheet berformat .csv.
        </p>
      </div>

      {/* Petunjuk Format CSV */}
      <div className="flex flex-col gap-3 rounded-2xl border border-garis bg-permukaan p-5 text-sm">
        <h2 className="font-bold text-teks">Format Kolom yang Didukung</h2>
        <p className="text-teks-lembut">
          Baris pertama file CSV harus memuat nama kolom (header). Kolom wajib:{" "}
          <code className="rounded bg-latar px-1.5 py-0.5 font-bold text-utama">nama</code> dan{" "}
          <code className="rounded bg-latar px-1.5 py-0.5 font-bold text-utama">harga</code>.
        </p>
        <div className="overflow-x-auto rounded-lg border border-garis bg-latar p-3 font-mono text-xs text-teks">
          nama,harga,kategori,foto_url,deskripsi<br />
          Kopi Robusta 250 g,45000,Minuman,/produk/kopi.svg,Kopi bubuk asli<br />
          Keripik Singkong,15000,Camilan,/produk/keripik.svg,Renyah dan gurih
        </div>
      </div>

      {/* Ringkasan Hasil Impor */}
      {state && (
        <div
          className={`flex flex-col gap-3 rounded-2xl border p-5 text-sm ${
            state.sukses
              ? "border-utama/30 bg-utama/5"
              : "border-bahaya/30 bg-bahaya/5"
          }`}
        >
          <h3 className="font-bold text-base">
            {state.sukses ? "Hasil Impor Selesai" : "Gagal Memproses Impor"}
          </h3>

          {state.error && <p className="text-bahaya">{state.error}</p>}

          {state.sukses && (
            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <span className="text-utama">
                ✓ Berhasil diimpor: <strong>{state.totalBerhasil}</strong> produk
              </span>
              {state.totalGagal > 0 && (
                <span className="text-bahaya">
                  ✗ Gagal: <strong>{state.totalGagal}</strong> baris
                </span>
              )}
            </div>
          )}

          {state.daftarError && state.daftarError.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-garis/50">
              <span className="font-semibold text-xs text-bahaya">
                Rincian Baris yang Bermasalah:
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-bahaya max-h-40 overflow-y-auto">
                {state.daftarError.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Form Upload */}
      <form action={formAction} className="flex max-w-xl flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm font-semibold text-teks">
          Pilih file CSV
          <input
            type="file"
            name="file_csv"
            accept=".csv,text/csv"
            required
            className="w-full rounded-lg border border-garis bg-latar p-2.5 text-sm text-teks file:mr-4 file:rounded-md file:border-0 file:bg-utama file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-utama-gelap"
          />
        </label>

        <div className="flex gap-3 pt-2">
          <Tombol type="submit" disabled={pending}>
            {pending ? "Mengimpor data..." : "Unggah dan Impor Produk"}
          </Tombol>
          <Tombol href="/admin" varian="garis">
            Batal
          </Tombol>
        </div>
      </form>
    </div>
  );
}