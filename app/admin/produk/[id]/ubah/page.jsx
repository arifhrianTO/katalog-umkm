import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { simpanProduk } from "@/app/admin/actions";
import { buatKlienAdmin } from "@/lib/supabase/admin";

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

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk produk={produk} aksi={simpanProduk} labelTombol="Simpan perubahan" />
    </div>
  );
}