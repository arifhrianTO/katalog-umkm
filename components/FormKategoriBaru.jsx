"use client";

import { useActionState } from "react";
import Tombol from "@/components/Tombol";
import { tambahKategori } from "@/app/admin/actions";

export default function FormKategoriBaru() {
  const [state, formAction, pending] = useActionState(tambahKategori, null);

  return (
    <form action={formAction} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="flex-1 w-full sm:max-w-sm">
        <input
          type="text"
          name="nama"
          placeholder="Nama kategori baru (mis. Camilan Manis)"
          required
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>
      <Tombol type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Kategori"}
      </Tombol>

      {state?.error && (
        <span className="text-xs text-bahaya font-semibold">{state.error}</span>
      )}
      {state?.sukses && (
        <span className="text-xs text-utama font-semibold">{state.sukses}</span>
      )}
    </form>
  );
}