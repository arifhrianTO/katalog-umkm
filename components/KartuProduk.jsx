import Link from "next/link";
import TombolFavorit from "@/components/TombolFavorit";
import TombolKeranjang from "@/components/TombolKeranjang";
import TombolBandingkan from "@/components/TombolBandingkan";
import { formatRupiah } from "@/lib/format";

export default function KartuProduk({ produk }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar transition-shadow hover:shadow-md">
      {/* Tombol Favorit (US-24) */}
      <div className="absolute right-2.5 top-2.5 z-10">
        <TombolFavorit produk={produk} ukuran="kecil" />
      </div>

      {/* Konten Kartu yang bisa diklik */}
      <Link href={`/produk/${produk.id}`} className="flex flex-1 flex-col">
        <div className="overflow-hidden bg-permukaan">
          <img
            src={produk.foto_url}
            alt={produk.nama}
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
          <p className="text-xs font-medium text-teks-lembut">{produk.kategori}</p>
          <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-utama">
            {produk.nama}
          </h3>
          <p className="mt-auto self-start rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
            {formatRupiah(produk.harga)}
          </p>
        </div>
      </Link>

      {/* Aksi Cepat: Keranjang (US-21) dan Bandingkan (US-37) */}
      <div className="flex items-center gap-1.5 border-t border-garis bg-permukaan/50 p-2">
        <TombolKeranjang produk={produk} varian="ikon" />
        <TombolBandingkan produk={produk} varian="ikon" />
      </div>
    </div>
  );
}