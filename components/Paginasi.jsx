import Link from "next/link";

const kelasDasar =
  "inline-flex min-w-9 items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold";

export default function Paginasi({ hal, totalHalaman, params }) {
  if (totalHalaman <= 1) {
    return null;
  }

  function tautan(nomor) {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.kategori) sp.set("kategori", params.kategori);
    if (params.urut) sp.set("urut", params.urut);
    if (nomor > 1) sp.set("hal", String(nomor));
    const qs = sp.toString();
    return qs ? `/?${qs}` : "/";
  }

  const nomorHalaman = Array.from({ length: totalHalaman }, (_, index) => index + 1);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Navigasi halaman">
      {hal > 1 && (
        <Link href={tautan(hal - 1)} className={`${kelasDasar} border-garis bg-latar text-teks hover:border-utama hover:text-utama`}>
          Sebelumnya
        </Link>
      )}

      {nomorHalaman.map((nomor) => (
        <Link
          key={nomor}
          href={tautan(nomor)}
          aria-current={nomor === hal ? "page" : undefined}
          className={
            nomor === hal
              ? `${kelasDasar} border-utama bg-utama text-white`
              : `${kelasDasar} border-garis bg-latar text-teks hover:border-utama hover:text-utama`
          }
        >
          {nomor}
        </Link>
      ))}

      {hal < totalHalaman && (
        <Link href={tautan(hal + 1)} className={`${kelasDasar} border-garis bg-latar text-teks hover:border-utama hover:text-utama`}>
          Berikutnya
        </Link>
      )}
    </nav>
  );
}