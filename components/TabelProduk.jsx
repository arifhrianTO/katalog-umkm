import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import TombolHapusProduk from "@/components/TombolHapusProduk";
import { toggleAktif, aturUrutanProduk } from "@/app/admin/actions";

export default function TabelProduk({ daftarProduk }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-garis bg-latar">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-permukaan text-teks-lembut border-b border-garis">
          <tr>
            <th className="px-4 py-3 font-semibold">Urutan</th>
            <th className="px-4 py-3 font-semibold">Produk</th>
            <th className="px-4 py-3 font-semibold">Kategori</th>
            <th className="px-4 py-3 font-semibold">Harga</th>
            <th className="px-4 py-3 font-semibold text-center">Stok</th>
            <th className="px-4 py-3 font-semibold text-center">Status</th>
            <th className="px-4 py-3 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-garis">
          {daftarProduk.map((produk) => (
            <tr
              key={produk.id}
              className={`hover:bg-permukaan/30 ${
                produk.aktif === false ? "opacity-60 bg-permukaan/20" : ""
              }`}
            >
              {/* US-47: Urutan Tampil (Naik / Turun) */}
              <td className="px-4 py-3 whitespace-nowrap">
                <form action={aturUrutanProduk} className="inline-flex items-center gap-1.5">
                  <input type="hidden" name="id" value={produk.id} />
                  <button
                    type="submit"
                    name="arah"
                    value="naik"
                    title="Naikkan prioritas urutan"
                    aria-label={`Naikkan urutan ${produk.nama}`}
                    className="flex h-6 w-6 items-center justify-center rounded border border-garis bg-latar text-xs font-bold text-teks hover:border-utama hover:text-utama"
                  >
                    ▲
                  </button>
                  <span className="w-5 text-center font-mono text-xs font-bold text-teks">
                    {produk.urutan ?? "-"}
                  </span>
                  <button
                    type="submit"
                    name="arah"
                    value="turun"
                    title="Turunkan prioritas urutan"
                    aria-label={`Turunkan urutan ${produk.nama}`}
                    className="flex h-6 w-6 items-center justify-center rounded border border-garis bg-latar text-xs font-bold text-teks hover:border-utama hover:text-utama"
                  >
                    ▼
                  </button>
                </form>
              </td>

              {/* Produk & Badge (US-20) */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={produk.foto_url}
                    alt=""
                    className="h-10 w-10 rounded-md object-cover bg-permukaan border border-garis"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-teks">{produk.nama}</span>
                    {produk.badge && (
                      <span className="self-start rounded bg-harga-latar px-1.5 py-0.2 text-[10px] font-bold text-harga">
                        {produk.badge}
                      </span>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-4 py-3 text-teks-lembut">{produk.kategori || "-"}</td>

              {/* Harga & Diskon (US-20) */}
              <td className="px-4 py-3 whitespace-nowrap">
                {produk.harga_diskon ? (
                  <div className="flex flex-col">
                    <span className="font-bold text-harga">
                      {formatRupiah(produk.harga_diskon)}
                    </span>
                    <span className="text-xs text-teks-lembut line-through">
                      {formatRupiah(produk.harga)}
                    </span>
                  </div>
                ) : (
                  <span className="font-medium text-teks">
                    {formatRupiah(produk.harga)}
                  </span>
                )}
              </td>

              {/* Stok (US-19) */}
              <td className="px-4 py-3 text-center whitespace-nowrap">
                {produk.stok === 0 ? (
                  <span className="inline-flex rounded-full bg-bahaya/10 px-2 py-0.5 text-xs font-bold text-bahaya">
                    Habis
                  </span>
                ) : produk.stok !== null && produk.stok !== undefined ? (
                  <span className="inline-flex rounded-full bg-utama/10 px-2 py-0.5 text-xs font-bold text-utama">
                    {produk.stok} unit
                  </span>
                ) : (
                  <span className="text-xs text-teks-lembut">Tersedia</span>
                )}
              </td>

              {/* US-32: Tombol Aktif / Nonaktif */}
              <td className="px-4 py-3 text-center whitespace-nowrap">
                <form action={toggleAktif}>
                  <input type="hidden" name="id" value={produk.id} />
                  <button
                    type="submit"
                    title={
                      produk.aktif !== false
                        ? "Klik untuk sembunyikan dari katalog publik"
                        : "Klik untuk tampilkan di katalog publik"
                    }
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                      produk.aktif !== false
                        ? "border border-utama/30 bg-utama/10 text-utama hover:bg-bahaya/10 hover:text-bahaya hover:border-bahaya/30"
                        : "border border-garis bg-permukaan text-teks-lembut hover:bg-utama/10 hover:text-utama hover:border-utama/30"
                    }`}
                  >
                    {produk.aktif !== false ? "● Aktif" : "○ Nonaktif"}
                  </button>
                </form>
              </td>

              {/* Aksi Ubah & Hapus */}
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                    Ubah
                  </Tombol>
                  <TombolHapusProduk id={produk.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}