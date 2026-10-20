// Helper favorit berbasis browser (US-24)
const KUNCI = "katalog_favorit";

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
    window.dispatchEvent(new Event("favorit-berubah"));
  } catch {
    // Abaikan jika storage penuh
  }
}

export function ambilFavorit() {
  return getStorage();
}

export function cekFavorit(id) {
  const items = getStorage();
  return items.some((i) => String(i.id) === String(id));
}

export function toggleFavorit(produk) {
  if (!produk?.id) return false;
  let items = getStorage();
  const ada = items.some((i) => String(i.id) === String(produk.id));

  if (ada) {
    items = items.filter((i) => String(i.id) !== String(produk.id));
    setStorage(items);
    return false;
  } else {
    items.push({
      id: produk.id,
      nama: produk.nama,
      harga: produk.harga,
      foto_url: produk.foto_url,
      kategori: produk.kategori,
    });
    setStorage(items);
    return true;
  }
}