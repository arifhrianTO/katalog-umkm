// Helper keranjang belanja berbasis browser (US-21)
const KUNCI = "katalog_keranjang";

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
    window.dispatchEvent(new Event("keranjang-berubah"));
  } catch {
    // Abaikan jika storage penuh
  }
}

export function ambilKeranjang() {
  return getStorage();
}

export function tambahKeKeranjang(produk, jumlah = 1) {
  if (!produk?.id) return;
  const items = getStorage();
  const index = items.findIndex((i) => String(i.id) === String(produk.id));

  if (index >= 0) {
    items[index].jumlah = (items[index].jumlah || 1) + jumlah;
  } else {
    items.push({
      id: produk.id,
      nama: produk.nama,
      harga: produk.harga,
      foto_url: produk.foto_url,
      kategori: produk.kategori,
      jumlah: Math.max(1, jumlah),
    });
  }

  setStorage(items);
}

export function ubahJumlahKeranjang(id, jumlah) {
  let items = getStorage();
  if (jumlah <= 0) {
    items = items.filter((i) => String(i.id) !== String(id));
  } else {
    items = items.map((i) =>
      String(i.id) === String(id) ? { ...i, jumlah } : i
    );
  }
  setStorage(items);
}

export function hapusDariKeranjang(id) {
  const items = getStorage().filter((i) => String(i.id) !== String(id));
  setStorage(items);
}

export function kosongkanKeranjang() {
  setStorage([]);
}

export function hitungTotalKeranjang(items) {
  const list = items || getStorage();
  const totalItem = list.reduce((acc, curr) => acc + (curr.jumlah || 1), 0);
  const totalHarga = list.reduce(
    (acc, curr) => acc + (curr.harga || 0) * (curr.jumlah || 1),
    0
  );
  return { totalItem, totalHarga };
}