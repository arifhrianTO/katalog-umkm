"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09).
// Mendukung validasi server per field dan preservasi nilai saat error (US-34).
export default function FormProduk({ produk = {}, aksi, labelTombol }) {
  const [state, formAction, pending] = useActionState(aksi, {
    error: null,
    errors: {},
    values: {},
  });

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

      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        key={`harga-${state?.values?.harga ?? produk.harga}`}
        defaultValue={state?.values?.harga ?? produk.harga ?? ""}
        error={state?.errors?.harga}
        required
      />

      <Input
        label="Kategori"
        name="kategori"
        key={`kategori-${state?.values?.kategori ?? produk.kategori}`}
        defaultValue={state?.values?.kategori ?? produk.kategori ?? ""}
        error={state?.errors?.kategori}
        placeholder="Misal: Minuman, Camilan, Kerajinan"
      />

      <Input
        label="Link foto"
        name="foto_url"
        key={`foto-${state?.values?.foto_url ?? produk.foto_url}`}
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={state?.values?.foto_url ?? produk.foto_url ?? ""}
        error={state?.errors?.foto_url}
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