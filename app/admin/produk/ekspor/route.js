import { buatKlienAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET() {
  const supabase = await buatKlienAdmin();

  // Validasi login di server (US-35)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized: Anda harus login untuk mengekspor data.", {
      status: 401,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("*")
    .order("id", { ascending: true });

  if (error || !daftarProduk) {
    return new Response("Gagal mengambil data produk dari database.", {
      status: 500,
    });
  }

  // Buat isi CSV
  const barisHeader = ["id", "nama", "harga", "kategori", "foto_url", "deskripsi", "created_at"]
    .map(escapeCsv)
    .join(",");

  const barisData = daftarProduk.map((p) =>
    [p.id, p.nama, p.harga, p.kategori, p.foto_url, p.deskripsi, p.created_at]
      .map(escapeCsv)
      .join(",")
  );

  const isiCsv = [barisHeader, ...barisData].join("\r\n");

  // Tambahkan UTF-8 BOM agar terbaca sempurna di Microsoft Excel
  const bom = "\uFEFF";

  return new Response(bom + isiCsv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="daftar-produk.csv"',
      "Cache-Control": "no-store",
    },
  });
}