import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import TombolBagikan from "@/components/TombolBagikan";
import TombolKeranjang from "@/components/TombolKeranjang";
import TombolFavorit from "@/components/TombolFavorit";
import TombolBandingkan from "@/components/TombolBandingkan";
import PenandaDilihat from "@/components/PenandaDilihat";
import GaleriProduk from "@/components/GaleriProduk";
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

  // US-32: Produk nonaktif menampilkan "tidak ditemukan"
  if (!produk || produk.aktif === false) {
    notFound();
  }

  let produkTerkait = [];
  if (produk.kategori) {
    const { data } = await supabase
      .from("produk")
      .select("*")
      .eq("kategori", produk.kategori)
      .neq("id", produk.id)
      .eq("aktif", true)
      .order("id", { ascending: true })
      .limit(4);

    produkTerkait = data || [];
  }

  const hargaUtama = produk.harga_diskon || produk.harga;
  const isHabis = produk.stok === 0;

  return (
    <>
      <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
        {/* US-18: Galeri foto produk */}
        <GaleriProduk
          fotoUtama={produk.foto_url}
          fotoTambahan={produk.foto_tambahan}
          nama={produk.nama}
        />

        <div className="flex flex-col gap-4">
          <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
            Kembali ke katalog
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {produk.kategori ? (
              <Link
                href={`/kategori/${slugKategori(produk.kategori)}`}
                className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
              >
                {produk.kategori}
              </Link>
            ) : null}

            {/* US-20: Badge Produk */}
            {produk.badge && (
              <span className="rounded bg-harga-latar px-2 py-0.5 text-xs font-bold text-harga">
                {produk.badge}
              </span>
            )}

            {/* US-19: Status Stok Habis */}
            {isHabis && (
              <span className="rounded bg-bahaya/10 px-2 py-0.5 text-xs font-bold text-bahaya">
                Habis
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>

          {/* US-20: Harga Coret dan Harga Diskon */}
          <div className="flex items-baseline gap-3">
            <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-2xl font-bold text-harga">
              {formatRupiah(hargaUtama)}
            </p>
            {produk.harga_diskon && (
              <p className="text-base text-teks-lembut line-through">
                {formatRupiah(produk.harga)}
              </p>
            )}
          </div>

          <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>

          {/* US-19: Tombol WhatsApp & Keranjang dinonaktifkan/disembunyikan saat stok habis */}
          {isHabis ? (
            <div className="rounded-xl border border-garis bg-permukaan p-4 text-center">
              <p className="font-bold text-bahaya">Produk Sedang Habis</p>
              <p className="text-xs text-teks-lembut mt-0.5">
                Pemesanan untuk produk ini sementara dinonaktifkan.
              </p>
            </div>
          ) : (
            <>
              <TombolWhatsApp produk={{ ...produk, harga: hargaUtama }} />
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-garis">
                <TombolKeranjang produk={{ ...produk, harga: hargaUtama }} varian="penuh" />
                <TombolFavorit produk={produk} />
                <TombolBandingkan produk={produk} varian="penuh" />
                <TombolBagikan nama={produk.nama} deskripsi={produk.deskripsi} />
              </div>
            </>
          )}
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