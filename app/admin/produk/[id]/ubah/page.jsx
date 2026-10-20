import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { simpanProduk } from "@/app/admin/actions";
import { buatKlienAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  const supabase = await buatKlienAdmin();
  const { data: produk } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .single();

  if (!produk) {
    notFound();
  }

  let daftarKategori = [];
  try {
    const { data: katData } = await supabase
      .from("kategori")
      .select("nama")
      .order("nama", { ascending: true });

    if (katData && katData.length > 0) {
      daftarKategori = katData.map((k) => k.nama);
    } else {
      const { data: pKat } = await supabase.from("produk").select("kategori");
      daftarKategori = [
        ...new Set((pKat || []).map((p) => p.kategori).filter(Boolean)),
      ].sort();
    }
  } catch {
    // Abaikan jika tabel kategori belum siap
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk
        produk={produk}
        daftarKategori={daftarKategori}
        aksi={simpanProduk}
        labelTombol="Simpan perubahan"
      />
    </div>
  );
}