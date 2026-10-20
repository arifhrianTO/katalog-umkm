import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolBagikan from "@/components/TombolBagikan";
import TombolKeranjang from "@/components/TombolKeranjang";
import TombolFavorit from "@/components/TombolFavorit";
import TombolBandingkan from "@/components/TombolBandingkan";
import PenandaDilihat from "@/components/PenandaDilihat";
import KartuProduk from "@/components/KartuProduk";
import { buatKlienServer } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";
import { slugKategori } from "@/lib/kategori";
import { toko } from "@/lib/toko";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const supabase = buatKlienServer();
    const { data: produk } = await supabase
      .from("produk")
      .select("nama, deskripsi, foto_url")
      .eq("id", id)
      .single();

    if (!produk) {
      return {
        title: "Produk Tidak Ditemukan",
      };
    }

    const judul = `${produk.nama} | ${toko.nama}`;
    const deskripsi =
      produk.deskripsi || `${produk.nama} berkualitas tersedia di ${toko.nama}.`;

    return {
      title: produk.nama,
      description: deskripsi,
      openGraph: {
        title: judul,
        description: deskripsi,
        type: "article",
        images: produk.foto_url
          ? [
              {
                url: produk.foto_url,
                alt: produk.nama,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: judul,
        description: deskripsi,
        images: produk.foto_url ? [produk.foto_url] : [],
      },
    };
  } catch {
    return {
      title: "Detail Produk",
    };
  }
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  const supabase = buatKlienServer();
  const { data: produk } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .single();

  if (!produk) {
    notFound();
  }

  let produkTerkait = [];
  if (produk.kategori) {
    const { data } = await supabase
      .from("produk")
      .select("*")
      .eq("kategori", produk.kategori)
      .neq("id", produk.id)
      .order("id", { ascending: true })
      .limit(4);

    produkTerkait = data || [];
  }

  return (
    <>
      <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
        />
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
            Kembali ke katalog
          </Link>
          {produk.kategori ? (
            <Link
              href={`/kategori/${slugKategori(produk.kategori)}`}
              className="self-start text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
            >
              {produk.kategori}
            </Link>
          ) : null}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
          <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
          <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
          <TombolWhatsApp produk={produk} />
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-garis">
            <TombolKeranjang produk={produk} varian="penuh" />
            <TombolFavorit produk={produk} />
            <TombolBandingkan produk={produk} varian="penuh" />
            <TombolBagikan nama={produk.nama} deskripsi={produk.deskripsi} />
          </div>
        </div>
      </article>

      <PenandaDilihat produk={produk} />

      {produkTerkait.length > 0 && (
        <section aria-labelledby="judul-terkait" className="flex flex-col gap-5 pb-8">
          <h2 id="judul-terkait" className="text-xl font-bold">
            Produk terkait
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {produkTerkait.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}