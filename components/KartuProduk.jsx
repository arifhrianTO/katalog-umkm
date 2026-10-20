import Link from "next/link";
import TombolFavorit from "@/components/TombolFavorit";
import TombolKeranjang from "@/components/TombolKeranjang";
import TombolBandingkan from "@/components/TombolBandingkan";
import { formatRupiah } from "@/lib/format";

export default function KartuProduk({ produk }) {
  const isHabis = produk.stok === 0;
  const hargaUtama = produk.harga_diskon || produk.harga;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar transition-shadow hover:shadow-md">
      {/* Badge Produk & Penanda Stok (US-19 & US-20) */}
      <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1 items-start">
        {isHabis && (
          <span className="rounded-md bg-bahaya px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
            Habis
          </span>
        )}
        {produk.badge && !isHabis && (
          <span className="rounded-md bg-utama px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
            {produk.badge}
          </span>
        )}
      </div>

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
            className={`aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isHabis ? "grayscale opacity-75" : ""
            }`}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
          <p className="text-xs font-medium text-teks-lembut">{produk.kategori}</p>
          <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-utama">
            {produk.nama}
          </h3>

          {/* US-20: Harga Normal vs Harga Coret */}
          <div className="mt-auto flex flex-wrap items-baseline gap-1.5 pt-1">
            <p className="self-start rounded-md bg-harga-latar px-2 py-0.5 text-sm font-bold text-harga">
              {formatRupiah(hargaUtama)}
            </p>
            {produk.harga_diskon && (
              <span className="text-xs text-teks-lembut line-through">
                {formatRupiah(produk.harga)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Aksi Cepat: Keranjang (US-21) dan Bandingkan (US-37) */}
      <div className="flex items-center gap-1.5 border-t border-garis bg-permukaan/50 p-2">
        {isHabis ? (
          <span className="flex-1 py-1.5 text-center text-xs font-semibold text-teks-lembut">
            Stok Habis
          </span>
        ) : (
          <TombolKeranjang produk={{ ...produk, harga: hargaUtama }} varian="ikon" />
        )}
        <TombolBandingkan produk={produk} varian="ikon" />
      </div>
    </div>
  );
}