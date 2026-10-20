import Link from "next/link";

export default function PaginasiAdmin({ hal, totalHalaman, q }) {
  if (totalHalaman <= 1) return null;

  function tautan(nomor) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (nomor > 1) sp.set("hal", String(nomor));
    const qs = sp.toString();
    return qs ? `/admin?${qs}` : "/admin";
  }

  const nomorHalaman = Array.from({ length: totalHalaman }, (_, i) => i + 1);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5 pt-3" aria-label="Navigasi halaman admin">
      {hal > 1 && (
        <Link
          href={tautan(hal - 1)}
          className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
        >
          ← Sebelumnya
        </Link>
      )}

      {nomorHalaman.map((nomor) => (
        <Link
          key={nomor}
          href={tautan(nomor)}
          aria-current={nomor === hal ? "page" : undefined}
          className={`inline-flex min-w-8 items-center justify-center rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
            nomor === hal
              ? "border-utama bg-utama text-white"
              : "border-garis bg-latar text-teks hover:border-utama hover:text-utama"
          }`}
        >
          {nomor}
        </Link>
      ))}

      {hal < totalHalaman && (
        <Link
          href={tautan(hal + 1)}
          className="inline-flex items-center justify-center rounded-lg border border-garis bg-latar px-3 py-1.5 text-xs font-semibold text-teks hover:border-utama hover:text-utama"
        >
          Berikutnya →
        </Link>
      )}
    </nav>
  );
}