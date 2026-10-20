import KartuProduk from "@/components/KartuProduk";
import FilterKatalog from "@/components/FilterKatalog";
import Paginasi from "@/components/Paginasi";
import TerakhirDilihat from "@/components/TerakhirDilihat";
import { buatKlienServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

const UKURAN_HALAMAN = 12;

function terapkanUrutan(query, urut) {
  if (urut === "termurah") {
    return query.order("harga", { ascending: true }).order("id", { ascending: true });
  }
  if (urut === "termahal") {
    return query.order("harga", { ascending: false }).order("id", { ascending: true });
  }
  if (urut === "terbaru") {
    return query.order("created_at", { ascending: false }).order("id", { ascending: false });
  }
  // US-47: Katalog publik mengikuti urutan tersebut (default)
  return query.order("urutan", { ascending: true, nullsFirst: false }).order("id", { ascending: true });
}

export default async function HalamanKatalog({ searchParams }) {
  const params = (await searchParams) || {};
  const q = (params.q || "").trim();
  const kategori = params.kategori || "";
  const urut = ["urutan", "terbaru", "termurah", "termahal"].includes(params.urut)
    ? params.urut
    : "urutan";
  const hal = Math.max(1, Number.parseInt(params.hal, 10) || 1);

  let daftarProduk = [];
  let daftarKategori = [];
  let totalHalaman = 1;
  let error = null;

  try {
    const supabase = buatKlienServer();

    let query = supabase.from("produk").select("*", { count: "exact" });

    // US-32: Sembunyikan produk nonaktif dari katalog publik
    query = query.eq("aktif", true);

    if (q) {
      query = query.ilike("nama", `%${q}%`);
    }
    if (kategori) {
      query = query.eq("kategori", kategori);
    }

    query = terapkanUrutan(query, urut);

    const dari = (hal - 1) * UKURAN_HALAMAN;
    query = query.range(dari, dari + UKURAN_HALAMAN - 1);

    const { data, count, error: queryError } = await query;

    if (queryError) {
      error = queryError.message || "Gagal mengambil daftar produk dari database.";
    } else {
      daftarProduk = data || [];
      totalHalaman = Math.max(1, Math.ceil((count || 0) / UKURAN_HALAMAN));
    }

    // US-31: Ambil daftar kategori dari tabel kategori
    const { data: katData } = await supabase
      .from("kategori")
      .select("nama")
      .order("nama", { ascending: true });

    if (katData && katData.length > 0) {
      daftarKategori = katData.map((k) => k.nama);
    } else {
      const { data: kategoriData } = await supabase
        .from("produk")
        .select("kategori")
        .eq("aktif", true)
        .not("kategori", "is", null);

      daftarKategori = [...new Set((kategoriData || []).map((item) => item.kategori))].sort((a, b) =>
        a.localeCompare(b)
      );
    }
  } catch (err) {
    error = err.message || "Terjadi kesalahan saat menghubungkan ke database.";
  }

  const adaFilter = Boolean(q || kategori);

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>

        <FilterKatalog q={q} kategori={kategori} urut={urut} daftarKategori={daftarKategori} />

        {error ? (
          <div className="rounded-2xl border border-garis bg-permukaan p-6 text-center">
            <p className="font-semibold text-bahaya">Gagal memuat produk</p>
            <p className="mt-1 text-sm text-teks-lembut">{error}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <div className="rounded-2xl border border-garis bg-permukaan p-8 text-center text-teks-lembut">
            {adaFilter
              ? "Tidak ada produk yang cocok dengan pencarian atau kategori itu."
              : "Belum ada produk"}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {daftarProduk.map((produk) => (
                <KartuProduk key={produk.id} produk={produk} />
              ))}
            </div>
            <Paginasi hal={hal} totalHalaman={totalHalaman} params={{ q, kategori, urut }} />
          </>
        )}
      </section>

      <TerakhirDilihat />
    </>
  );
}