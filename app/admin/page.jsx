import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatKlienAdmin } from "@/lib/supabase/admin";

export default async function HalamanAdmin() {
  const supabase = await buatKlienAdmin();
  const { data, error } = await supabase
    .from("produk")
    .select("*")
    .order("id", { ascending: true });

  const daftarProduk = data || [];

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {error ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-6 text-center">
          <p className="font-semibold text-bahaya">Gagal memuat produk</p>
          <p className="mt-1 text-sm text-teks-lembut">
            {error.message || "Terjadi kesalahan saat mengambil data dari database."}
          </p>
        </div>
      ) : daftarProduk.length === 0 ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-8 text-center text-teks-lembut">
          Belum ada produk. Tekan "Tambah produk" untuk membuat yang pertama.
        </div>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}