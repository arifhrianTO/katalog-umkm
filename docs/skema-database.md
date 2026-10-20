# Skema Database

## Tabel `produk`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | bigint | Nomor unik, dibuat otomatis |
| `nama` | text | Nama produk, wajib diisi |
| `harga` | integer | Harga dalam rupiah, tidak boleh negatif |
| `deskripsi` | text | Penjelasan produk |
| `foto_url` | text | Link gambar produk utama |
| `foto_tambahan` | text[] | Array link gambar tambahan untuk galeri (US-18) |
| `stok` | integer | Jumlah stok produk; null = tersedia, 0 = habis (US-19) |
| `harga_diskon` | integer | Harga diskon dalam rupiah jika promo (US-20) |
| `badge` | text | Label khusus seperti "Baru" atau "Terlaris" (US-20) |
| `aktif` | boolean | Status tampil di katalog; false = sembunyikan (US-32) |
| `urutan` | integer | Nomor urutan prioritas tampil di katalog (US-47) |
| `kategori` | text | Kelompok produk, misalnya "Camilan" |
| `created_at` | timestamptz | Waktu dibuat, otomatis |

## Tabel `kategori` (US-31)

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | bigint | Nomor unik |
| `nama` | text | Nama kategori, unik dan wajib |
| `slug` | text | URL slug kategori, unik dan wajib |
| `created_at` | timestamptz | Waktu dibuat, otomatis |

## Aturan akses (RLS)

Row Level Security aktif di tabel `produk`.

| Siapa | Baca | Tambah | Ubah | Hapus |
| --- | --- | --- | --- | --- |
| Publik (tanpa login) | Ditolak | Ditolak | Ditolak | Ditolak |
| Admin yang login | Boleh | Boleh | Boleh | Boleh |

Pengunjung tetap bisa melihat katalog karena data dibaca oleh server memakai kunci rahasia, bukan langsung dari browser.

Skrip lengkap ada di `docs/schema.sql`.
