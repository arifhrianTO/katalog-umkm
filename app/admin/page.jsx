import Link from "next/link";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import PaginasiAdmin from "@/components/PaginasiAdmin";
import { buatKlienAdmin } from "@/lib/supabase/admin";

const UKURAN_HALAMAN = 10;

export default async function HalamanAdmin({ searchParams }) {
  const params = (await searchParams) || {};
  const q = (params.q || "").trim();
  const hal = Math.max(1, Number.parseInt(params.hal, 10) || 1);

  const supabase = await buatKlienAdmin();

  // 1. Ambil seluruh data untuk ringkasan Dashboard (US-30)
  const { data: semuaProdukData } = await supabase
    .from("produk")
    .select("kategori");

  const totalProdukSemua = semuaProdukData?.length || 0;

  // Hitung produk per kategori
  const ringkasanKategori = {};
  (semuaProdukData || []).forEach((item) => {
    const kat = item.kategori || "Tanpa Kategori";
    ringkasanKategori[kat] = (ringkasanKategori[kat] || 0) + 1;
  });

  const daftarKategoriRingkasan = Object.entries(ringkasanKategori).sort(
    (a, b) => b[1] - a[1]
  );

  // 2. Query data produk dengan filter cari & paginasi (US-33)
  let query = supabase.from("produk").select("*", { count: "exact" });

  if (q) {
    query = query.ilike("nama", `%${q}%`);
  }

  query = query.order("id", { ascending: true });

  const dari = (hal - 1) * UKURAN_HALAMAN;
  query = query.range(dari, dari + UKURAN_HALAMAN - 1);

  const { data, count, error } = await query;
  const daftarProduk = data || [];
  const totalHalaman = Math.max(1, Math.ceil((count || 0) / UKURAN_HALAMAN));

  return (
    <div className="flex flex-col gap-8 py-8">
      <NavAdmin />

      {/* US-30: Dashboard Ringkasan Admin */}
      <section aria-labelledby="judul-ringkasan" className="flex flex-col gap-4">
        <h2 id="judul-ringkasan" className="text-xl font-bold">
          Ringkasan Toko
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Kartu Total Produk */}
          <div className="flex flex-col gap-1 rounded-2xl border border-garis bg-permukaan p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-teks-lembut">
              Total Produk Aktif
            </span>
            <span className="text-3xl font-extrabold text-utama">
              {totalProdukSemua}
            </span>
            <span className="text-xs text-teks-lembut">
              Tercatat di database katalog toko
            </span>
          </div>

          {/* Kartu Total Kategori */}
          <div className="flex flex-col gap-1 rounded-2xl border border-garis bg-permukaan p-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-teks-lembut">
              Total Kategori
            </span>
            <span className="text-3xl font-extrabold text-harga">
              {daftarKategoriRingkasan.length}
            </span>
            <span className="text-xs text-teks-lembut">
              Kelompok kategori produk yang tersedia
            </span>
          </div>

          {/* Rincian Produk per Kategori */}
          <div className="flex flex-col gap-2 rounded-2xl border border-garis bg-permukaan p-5 sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-teks-lembut">
              Produk per Kategori
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
              {daftarKategoriRingkasan.map(([kat, jml]) => (
                <span
                  key={kat}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-garis bg-latar px-2.5 py-1 text-xs font-semibold text-teks"
                >
                  <span>{kat}:</span>
                  <span className="rounded bg-utama/10 px-1 text-utama font-bold">{jml}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bagian Manajemen Produk (US-33, US-35, US-46) */}
      <section aria-labelledby="judul-kelola" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 id="judul-kelola" className="text-2xl font-extrabold">
              Kelola Produk
            </h1>
            <p className="text-xs text-teks-lembut">
              Menampilkan {daftarProduk.length} dari total {count || 0} produk
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
            <Tombol href="/admin/produk/impor" varian="garis">
              Impor CSV
            </Tombol>
            <a
              href="/admin/produk/ekspor"
              className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-4 py-2.5 text-sm font-semibold text-teks transition-colors hover:border-utama hover:text-utama"
            >
              Ekspor CSV
            </a>
          </div>
        </div>

        {/* Kolom Cari Produk (US-33) */}
        <form
          action="/admin"
          method="get"
          className="flex flex-wrap items-center gap-2 rounded-xl border border-garis bg-latar p-3"
        >
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Cari nama produk di admin..."
              className="w-full rounded-lg border border-garis bg-permukaan px-3 py-2 text-sm text-teks focus:border-utama focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-utama px-4 py-2 text-sm font-semibold text-white hover:bg-utama-gelap"
          >
            Cari
          </button>
          {q && (
            <Link
              href="/admin"
              className="px-3 py-2 text-sm font-semibold text-teks-lembut hover:text-bahaya underline"
            >
              Reset
            </Link>
          )}
        </form>

        {error ? (
          <div className="rounded-2xl border border-garis bg-permukaan p-6 text-center">
            <p className="font-semibold text-bahaya">Gagal memuat produk</p>
            <p className="mt-1 text-sm text-teks-lembut">
              {error.message || "Terjadi kesalahan saat mengambil data dari database."}
            </p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <div className="rounded-2xl border border-garis bg-permukaan p-8 text-center text-teks-lembut">
            {q
              ? `Tidak ada produk yang cocok dengan kata kunci "${q}".`
              : 'Belum ada produk. Tekan "Tambah produk" untuk membuat yang pertama.'}
          </div>
        ) : (
          <>
            <TabelProduk daftarProduk={daftarProduk} />
            <PaginasiAdmin hal={hal} totalHalaman={totalHalaman} q={q} />
          </>
        )}
      </section>
    </div>
  );
}