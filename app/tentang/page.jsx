import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `Tentang Kami | ${toko.nama}`,
  description: `Profil dan kontak resmi ${toko.nama}. ${toko.tagline}`,
};

export default function HalamanTentang() {
  const nomor = (toko.nomorWhatsApp || "").replace(/\D/g, "");
  const pesan = `Halo ${toko.nama}, saya ingin bertanya tentang toko dan produk yang dijual.`;
  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-8 py-10 sm:py-14">
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama"
        >
          ← Kembali ke katalog
        </Link>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          Tentang {toko.nama}
        </h1>
        <p className="text-lg text-teks-lembut">{toko.tagline}</p>
      </div>

      <section aria-labelledby="profil-toko" className="flex flex-col gap-4 rounded-2xl border border-garis bg-latar p-6">
        <h2 id="profil-toko" className="text-xl font-bold">
          Profil Toko
        </h2>
        <p className="leading-relaxed text-teks-lembut">
          {toko.nama} adalah usaha mikro, kecil, dan menengah (UMKM) lokal yang berdedikasi
          menyediakan produk berkualitas untuk Anda. Semua produk dibuat dan dipilih dengan cermat
          langsung dari dapur dan perajin terbaik.
        </p>
      </section>

      <section aria-labelledby="informasi-toko" className="flex flex-col gap-4 rounded-2xl border border-garis bg-permukaan p-6">
        <h2 id="informasi-toko" className="text-xl font-bold">
          Alamat & Jam Operasional
        </h2>
        <div className="grid gap-3 text-sm">
          <div>
            <span className="font-semibold text-teks">Alamat:</span>
            <p className="text-teks-lembut">{toko.alamat}</p>
          </div>
          <div>
            <span className="font-semibold text-teks">Jam Buka:</span>
            <p className="text-teks-lembut">{toko.jamBuka}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="kontak-toko" className="flex flex-col gap-4 rounded-2xl border border-garis bg-latar p-6">
        <h2 id="kontak-toko" className="text-xl font-bold">
          Hubungi Kami
        </h2>
        <p className="text-sm text-teks-lembut">
          Punya pertanyaan seputar produk, pemesanan khusus, atau ketersediaan stok? Jangan ragu
          untuk menyapa kami melalui WhatsApp.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap"
          >
            Chat WhatsApp ({toko.nomorWhatsApp})
          </a>
        </div>
      </section>
    </article>
  );
}