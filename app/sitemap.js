import { buatKlienServer } from "@/lib/supabase/server";
import { slugKategori } from "@/lib/kategori";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  let ruteProduk = [];
  let ruteKategori = [];

  try {
    const supabase = buatKlienServer();

    // Ambil semua produk untuk rute /produk/[id]
    const { data: daftarProduk } = await supabase
      .from("produk")
      .select("id, created_at, kategori");

    if (daftarProduk) {
      ruteProduk = daftarProduk.map((item) => ({
        url: `${baseUrl}/produk/${item.id}`,
        lastModified: item.created_at ? new Date(item.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }));

      // Kategori unik untuk rute /kategori/[slug]
      const kategoriUnik = [
        ...new Set(daftarProduk.map((p) => p.kategori).filter(Boolean)),
      ];

      ruteKategori = kategoriUnik.map((kat) => ({
        url: `${baseUrl}/kategori/${slugKategori(kat)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch {
    // Jika koneksi gagal saat build, fallback ke rute dasar
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...ruteKategori,
    ...ruteProduk,
  ];
}