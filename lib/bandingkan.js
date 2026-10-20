// Helper bandingkan produk berbasis browser (US-37, maks 2 produk)
const KUNCI = "katalog_bandingkan";

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
    window.dispatchEvent(new Event("bandingkan-berubah"));
  } catch {
    // Abaikan jika storage penuh
  }
}

export function ambilBandingkan() {
  return getStorage();
}

export function cekBandingkan(id) {
  const items = getStorage();
  return items.some((i) => String(i.id) === String(id));
}

export function toggleBandingkan(produk) {
  if (!produk?.id) return { status: "gagal", pesan: "Produk tidak valid" };
  let items = getStorage();
  const ada = items.some((i) => String(i.id) === String(produk.id));

  if (ada) {
    items = items.filter((i) => String(i.id) !== String(produk.id));
    setStorage(items);
    return { status: "dihapus", pesan: "Dihapus dari perbandingan" };
  }

  // Jika sudah ada 2 produk, gantikan produk yang paling lama dipilih
  if (items.length >= 2) {
    items.shift(); // Hapus item pertama (tertua)
    items.push({
      id: produk.id,
      nama: produk.nama,
      harga: produk.harga,
      foto_url: produk.foto_url,
      kategori: produk.kategori,
      deskripsi: produk.deskripsi,
    });
    setStorage(items);
    return {
      status: "diganti",
      pesan: "Maksimal 2 produk. Pilihan lama digantikan dengan produk ini.",
    };
  }

  items.push({
    id: produk.id,
    nama: produk.nama,
    harga: produk.harga,
    foto_url: produk.foto_url,
    kategori: produk.kategori,
    deskripsi: produk.deskripsi,
  });
  setStorage(items);
  return { status: "ditambah", pesan: "Ditambahkan ke perbandingan" };
}

export function hapusBandingkan(id) {
  const items = getStorage().filter((i) => String(i.id) !== String(id));
  setStorage(items);
}

export function kosongkanBandingkan() {
  setStorage([]);
}