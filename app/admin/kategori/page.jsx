import Link from "next/link";
import NavAdmin from "@/components/NavAdmin";
import FormKategoriBaru from "@/components/FormKategoriBaru";
import BarisKategori from "@/components/BarisKategori";
import { buatKlienAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function HalamanKelolaKategori({ searchParams }) {
  const params = (await searchParams) || {};
  const pesanError = params.error;
  const pesanSukses = params.sukses;

  const supabase = await buatKlienAdmin();

  // 1. Ambil semua kategori dari database (US-31)
  const { data: daftarKategori } = await supabase
    .from("kategori")
    .select("*")
    .order("nama", { ascending: true });

  // 2. Hitung produk per kategori
  const { data: produkData } = await supabase
    .from("produk")
    .select("kategori");

  const hitungProduk = {};
  (produkData || []).forEach((item) => {
    if (item.kategori) {
      hitungProduk[item.kategori] = (hitungProduk[item.kategori] || 0) + 1;
    }
  });

  const list = daftarKategori || [];

  return (
    <div className="flex flex-col gap-8 py-8">
      <NavAdmin />

      <div className="flex flex-col gap-1">
        <Link
          href="/admin"
          className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama self-start"
        >
          ← Kembali ke kelola produk
        </Link>
        <h1 className="text-2xl font-extrabold">Kelola Kategori Produk</h1>
        <p className="text-sm text-teks-lembut">
          Atur daftar kategori toko. Kategori yang masih digunakan produk tidak dapat dihapus.
        </p>
      </div>

      {/* Notifikasi Pesan */}
      {pesanError && (
        <div className="rounded-xl border border-bahaya/30 bg-bahaya/5 p-4 text-sm text-bahaya font-semibold">
          {pesanError}
        </div>
      )}
      {pesanSukses && (
        <div className="rounded-xl border border-utama/30 bg-utama/5 p-4 text-sm text-utama font-semibold">
          {pesanSukses}
        </div>
      )}

      {/* Form Tambah Kategori Baru */}
      <section aria-labelledby="judul-tambah-kategori" className="rounded-2xl border border-garis bg-permukaan p-5">
        <h2 id="judul-tambah-kategori" className="text-base font-bold text-teks mb-3">
          Tambah Kategori Baru
        </h2>
        <FormKategoriBaru />
      </section>

      {/* Tabel Kategori */}
      <section aria-labelledby="judul-daftar-kategori" className="flex flex-col gap-4">
        <h2 id="judul-daftar-kategori" className="text-xl font-bold">
          Daftar Kategori ({list.length})
        </h2>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-garis bg-permukaan p-8 text-center text-teks-lembut">
            Belum ada kategori yang dibuat.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-garis bg-latar">
            <table className="w-full text-left text-sm min-w-[500px]">
              <thead className="bg-permukaan text-teks-lembut border-b border-garis">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nama Kategori</th>
                  <th className="px-4 py-3 font-semibold">Slug URL</th>
                  <th className="px-4 py-3 font-semibold text-center">Jumlah Produk</th>
                  <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-garis">
                {list.map((kat) => (
                  <BarisKategori
                    key={kat.id}
                    kategori={kat}
                    jumlahProduk={hitungProduk[kat.nama] || 0}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}