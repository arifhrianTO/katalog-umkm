"use client";

import { useState, useActionState } from "react";
import { ubahKategori, hapusKategori } from "@/app/admin/actions";

export default function BarisKategori({ kategori, jumlahProduk }) {
  const [isEdit, setIsEdit] = useState(false);
  const [state, formAction, pending] = useActionState(ubahKategori, null);

  return (
    <tr className="hover:bg-permukaan/30">
      <td className="px-4 py-3 font-semibold text-teks">
        {isEdit ? (
          <form action={formAction} className="flex items-center gap-2">
            <input type="hidden" name="id" value={kategori.id} />
            <input type="hidden" name="nama_lama" value={kategori.nama} />
            <input
              type="text"
              name="nama"
              defaultValue={kategori.nama}
              required
              className="rounded-lg border border-garis bg-latar px-2.5 py-1 text-sm text-teks focus:border-utama focus:outline-none"
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded bg-utama px-2.5 py-1 text-xs font-semibold text-white hover:bg-utama-gelap disabled:opacity-50"
            >
              {pending ? "..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => setIsEdit(false)}
              className="rounded border border-garis px-2 py-1 text-xs font-semibold text-teks-lembut hover:text-teks"
            >
              Batal
            </button>
            {state?.error && (
              <span className="text-xs text-bahaya ml-2">{state.error}</span>
            )}
          </form>
        ) : (
          <span>{kategori.nama}</span>
        )}
      </td>

      <td className="px-4 py-3 font-mono text-xs text-teks-lembut">
        {kategori.slug}
      </td>

      <td className="px-4 py-3 text-center">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
            jumlahProduk > 0
              ? "bg-utama/10 text-utama"
              : "bg-garis/50 text-teks-lembut"
          }`}
        >
          {jumlahProduk} produk
        </span>
      </td>

      <td className="px-4 py-3 text-right">
        {!isEdit && (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEdit(true)}
              className="rounded border border-garis bg-latar px-2.5 py-1 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
            >
              Ubah
            </button>

            <form
              action={hapusKategori}
              onSubmit={(e) => {
                if (jumlahProduk > 0) {
                  alert(
                    `Kategori "${kategori.nama}" masih dipakai oleh ${jumlahProduk} produk. Hapus atau pindahkan kategori produk tersebut terlebih dahulu.`
                  );
                  e.preventDefault();
                  return;
                }
                if (
                  !window.confirm(
                    `Apakah Anda yakin ingin menghapus kategori "${kategori.nama}"?`
                  )
                ) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="id" value={kategori.id} />
              <button
                type="submit"
                className="rounded border border-garis bg-latar px-2.5 py-1 text-xs font-semibold text-bahaya hover:border-bahaya"
              >
                Hapus
              </button>
            </form>
          </div>
        )}
      </td>
    </tr>
  );
}