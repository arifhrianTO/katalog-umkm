// Helper riwayat produk terakhir dilihat (US-36, maks 6 produk)
const KUNCI = "katalog_riwayat_dilihat";
const MAKSIMAL = 6;

function getStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KUNCI);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStorage(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KUNCI, JSON.stringify(items));
    window.dispatchEvent(new Event("riwayat-berubah"));
  } catch {
    // Abaikan jika storage penuh
  }
}

export function ambilRiwayat() {
  return getStorage();
}

export function catatRiwayat(produk) {
  if (!produk?.id) return;
  let items = getStorage();

  // Hapus jika sudah ada agar posisinya pindah ke paling depan (terbaru)
  items = items.filter((i) => String(i.id) !== String(produk.id));

  items.unshift({
    id: produk.id,
    nama: produk.nama,
    harga: produk.harga,
    foto_url: produk.foto_url,
    kategori: produk.kategori,
  });

  if (items.length > MAKSIMAL) {
    items = items.slice(0, MAKSIMAL);
  }

  setStorage(items);
}