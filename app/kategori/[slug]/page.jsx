import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import { buatKlienServer } from "@/lib/supabase/server";
import { slugKategori } from "@/lib/kategori";

export const dynamic = "force-dynamic";

export default async function HalamanKategori({ params }) {
  const { slug } = await params;

  const supabase = buatKlienServer();

  let namaKategori = null;

  // Coba cari dari tabel kategori terlebih dahulu (US-31)
  try {
    const { data: katData } = await supabase
      .from("kategori")
      .select("nama, slug");

    if (katData && katData.length > 0) {
      const cocok = katData.find(
        (k) => k.slug === slug || slugKategori(k.nama) === slug
      );
      if (cocok) {
        namaKategori = cocok.nama;
      }
    }
  } catch {
    // Abaikan jika tabel kategori belum ada
  }

  // Fallback ke tabel produk
  if (!namaKategori) {
    const { data: kategoriData } = await supabase
      .from("produk")
      .select("kategori")
      .eq("aktif", true)
      .not("kategori", "is", null);

    const daftarKategori = [
      ...new Set((kategoriData || []).map((item) => item.kategori)),
    ];
    namaKategori = daftarKategori.find((nama) => slugKategori(nama) === slug);
  }

  if (!namaKategori) {
    notFound();
  }

  // US-32: Hanya ambil produk yang aktif; US-47: Ikuti urutan tampil
  const { data } = await supabase
    .from("produk")
    .select("*")
    .eq("kategori", namaKategori)
    .eq("aktif", true)
    .order("urutan", { ascending: true, nullsFirst: false })
    .order("id", { ascending: true });

  const daftarProduk = data || [];

  return (
    <section className="flex flex-col gap-5 py-8">
      <Link
        href="/"
        className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama self-start"
      >
        ← Kembali ke katalog
      </Link>
      <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
        {namaKategori}
      </h1>

      {daftarProduk.length === 0 ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-8 text-center text-teks-lembut">
          Belum ada produk aktif di kategori ini.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {daftarProduk.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </section>
  );
}