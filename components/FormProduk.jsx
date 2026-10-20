"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// Mendukung US-18 (galeri), US-19 (stok), US-20 (harga diskon & badge), US-31 (kategori DB), US-34 (validasi server), US-47 (urutan).
export default function FormProduk({
  produk = {},
  aksi,
  labelTombol,
  daftarKategori = [],
}) {
  const [state, formAction, pending] = useActionState(aksi, {
    error: null,
    errors: {},
    values: {},
  });

  const fotoTambahanDefault = Array.isArray(produk.foto_tambahan)
    ? produk.foto_tambahan.join("\n")
    : produk.foto_tambahan || "";

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {produk.id ? <input type="hidden" name="id" value={produk.id} /> : null}

      <Input
        label="Nama produk"
        name="nama"
        key={`nama-${state?.values?.nama ?? produk.nama}`}
        defaultValue={state?.values?.nama ?? produk.nama ?? ""}
        error={state?.errors?.nama}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Harga normal (Rp)"
          name="harga"
          type="number"
          min="0"
          key={`harga-${state?.values?.harga ?? produk.harga}`}
          defaultValue={state?.values?.harga ?? produk.harga ?? ""}
          error={state?.errors?.harga}
          required
        />

        <Input
          label="Harga diskon promo (Rp, opsional)"
          name="harga_diskon"
          type="number"
          min="0"
          key={`harga_diskon-${state?.values?.harga_diskon ?? produk.harga_diskon}`}
          defaultValue={state?.values?.harga_diskon ?? produk.harga_diskon ?? ""}
          error={state?.errors?.harga_diskon}
          placeholder="Lebih kecil dari harga normal"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Dropdown Kategori dari Database (US-31) */}
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Kategori
          <select
            name="kategori"
            defaultValue={state?.values?.kategori ?? produk.kategori ?? ""}
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
          >
            <option value="">Pilih Kategori</option>
            {daftarKategori.map((kat) => {
              const namaKat = typeof kat === "string" ? kat : kat.nama;
              return (
                <option key={namaKat} value={namaKat}>
                  {namaKat}
                </option>
              );
            })}
          </select>
          {state?.errors?.kategori && (
            <span className="text-xs font-medium text-bahaya">
              {state.errors.kategori}
            </span>
          )}
        </label>

        {/* Badge Label (US-20) */}
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Badge Label
          <select
            name="badge"
            defaultValue={state?.values?.badge ?? produk.badge ?? ""}
            className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none"
          >
            <option value="">Tanpa Badge</option>
            <option value="Baru">Baru</option>
            <option value="Terlaris">Terlaris</option>
            <option value="Promo">Promo</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Stok Produk (US-19) */}
        <Input
          label="Jumlah stok"
          name="stok"
          type="number"
          min="0"
          key={`stok-${state?.values?.stok ?? produk.stok}`}
          defaultValue={state?.values?.stok ?? produk.stok ?? ""}
          error={state?.errors?.stok}
          placeholder="Kosongkan jika selalu ada, 0 jika habis"
        />

        {/* Urutan Prioritas Tampil (US-47) */}
        <Input
          label="Nomor urutan tampil"
          name="urutan"
          type="number"
          min="1"
          key={`urutan-${state?.values?.urutan ?? produk.urutan}`}
          defaultValue={state?.values?.urutan ?? produk.urutan ?? ""}
          error={state?.errors?.urutan}
          placeholder="Misal 1, 2, 3 (prioritas awal)"
        />
      </div>

      <Input
        label="Link foto utama"
        name="foto_url"
        key={`foto-${state?.values?.foto_url ?? produk.foto_url}`}
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={state?.values?.foto_url ?? produk.foto_url ?? ""}
        error={state?.errors?.foto_url}
      />

      {/* Foto Tambahan untuk Galeri (US-18) */}
      <Input
        label="Link foto tambahan untuk galeri (satu URL per baris)"
        name="foto_tambahan"
        textarea
        rows={3}
        key={`foto_tambahan-${state?.values?.foto_tambahan ?? fotoTambahanDefault}`}
        placeholder={"https://example.com/foto1.jpg\nhttps://example.com/foto2.jpg"}
        defaultValue={state?.values?.foto_tambahan ?? fotoTambahanDefault}
        error={state?.errors?.foto_tambahan}
      />

      <Input
        label="Deskripsi"
        name="deskripsi"
        textarea
        key={`deskripsi-${state?.values?.deskripsi ?? produk.deskripsi}`}
        defaultValue={state?.values?.deskripsi ?? produk.deskripsi ?? ""}
        error={state?.errors?.deskripsi}
      />

      {state?.error && (
        <p className="rounded-lg border border-bahaya/20 bg-bahaya/5 px-3 py-2 text-sm text-bahaya">
          {state.error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Tombol type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}