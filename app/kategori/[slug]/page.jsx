import Link from "next/link";
import { notFound } from "next/navigation";
import KartuProduk from "@/components/KartuProduk";
import { buatKlienServer } from "@/lib/supabase/server";
import { slugKategori } from "@/lib/kategori";

export const dynamic = "force-dynamic";

export default async function HalamanKategori({ params }) {
  const { slug } = await params;

  const supabase = buatKlienServer();

  const { data: kategoriData } = await supabase
    .from("produk")
    .select("kategori")
    .not("kategori", "is", null);

  const daftarKategori = [...new Set((kategoriData || []).map((item) => item.kategori))];
  const namaKategori = daftarKategori.find((nama) => slugKategori(nama) === slug);

  if (!namaKategori) {
    notFound();
  }

  const { data } = await supabase
    .from("produk")
    .select("*")
    .eq("kategori", namaKategori)
    .order("id", { ascending: true });

  const daftarProduk = data || [];

  return (
    <section className="flex flex-col gap-5 py-8">
      <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
        Kembali ke katalog
      </Link>
      <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{namaKategori}</h1>

      {daftarProduk.length === 0 ? (
        <div className="rounded-2xl border border-garis bg-permukaan p-8 text-center text-teks-lembut">
          Belum ada produk di kategori ini.
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