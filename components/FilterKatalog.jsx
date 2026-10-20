import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

const pilihanUrut = [
  { nilai: "terbaru", label: "Terbaru" },
  { nilai: "termurah", label: "Termurah" },
  { nilai: "termahal", label: "Termahal" },
];

const kelasSelect =
  "w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks focus:border-utama focus:outline-none";

export default function FilterKatalog({ q, kategori, urut, daftarKategori }) {
  return (
    <form
      action="/"
      method="get"
      className="flex flex-col gap-4 rounded-2xl border border-garis bg-permukaan p-4 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="min-w-[12rem] flex-1">
        <Input
          label="Cari produk"
          name="q"
          defaultValue={q}
          placeholder="Nama produk..."
          type="search"
        />
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-semibold sm:w-48">
        Kategori
        <select name="kategori" defaultValue={kategori} className={kelasSelect}>
          <option value="">Semua kategori</option>
          {daftarKategori.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-semibold sm:w-40">
        Urutkan
        <select name="urut" defaultValue={urut} className={kelasSelect}>
          {pilihanUrut.map((item) => (
            <option key={item.nilai} value={item.nilai}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <Tombol type="submit">Terapkan</Tombol>
    </form>
  );
}