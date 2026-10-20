# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**

Kerjakan US-01. Halaman `/` menampilkan semua produk dari tabel `produk` di Supabase (bukan `lib/data-contoh.js`), data diambil di sisi server, tiap kartu menampilkan foto, kategori, nama, dan harga format rupiah, dan ada pesan jelas jika belum ada produk.

**Hasil:**

`app/page.jsx` menjadi Server Component `async` yang membaca data lewat `lib/supabase/server.js` (kunci rahasia, hanya di server). Kartu memakai `components/KartuProduk.jsx` dan `lib/format.js`.

**Perbaikan:**

Menambahkan penanganan error query (tampil pesan "Gagal memuat produk") dan kondisi khusus saat database masih kosong.

## US-02 Detail produk

**Prompt:**

Kerjakan US-02. Halaman `/produk/[id]` menampilkan foto, kategori, nama, harga, dan deskripsi dari database, dan menampilkan halaman "tidak ditemukan" bila produk tidak ada.

**Hasil:**

`app/produk/[id]/page.jsx` mengambil satu produk dengan `.eq("id", id).single()` dan memanggil `notFound()` bila kosong. `params` dibaca sebagai Promise (`await params`) sesuai Next.js 16.

**Perbaikan:**

Menambahkan `app/not-found.jsx` kustom dengan tautan kembali ke katalog.

## US-03 Pesan via WhatsApp

**Prompt:**

Kerjakan US-03. Tombol "Pesan via WhatsApp" membuka WhatsApp ke nomor di `lib/toko.js`, pesan sudah terisi nama dan harga produk, dan berfungsi di HP maupun laptop.

**Hasil:**

`components/TombolWhatsApp.jsx` menyusun link `https://wa.me/<nomor>?text=<pesan>` dan meng-encode pesan dengan `encodeURIComponent`.

**Perbaikan:**

Nomor dinormalkan dengan menghapus karakter non-angka dari `toko.nomorWhatsApp`, dan harga diformat dengan `formatRupiah`.

## US-04 Login admin

**Prompt:**

Kerjakan US-04. Login memakai Supabase Auth dan diproses di server, login berhasil mengarah ke `/admin`, login gagal menampilkan pesan jelas, dan tombol "Keluar" mengakhiri sesi.

**Hasil:**

`app/admin/actions.js` berisi `login` dan `logout` (Server Action) memakai `buatKlienAdmin()`. `app/admin/login/page.jsx` memakai `useActionState`.

**Perbaikan:**

Pesan error disamarkan menjadi "Email atau password salah" agar tidak membocorkan mana yang keliru.

## US-05 Ganti password

**Prompt:**

Kerjakan US-05. Form di `/admin/password` mengganti password admin yang sedang login, password baru minimal 8 karakter dan harus sama dengan konfirmasi, dengan pesan berhasil atau error yang jelas.

**Hasil:**

`gantiPassword` di `app/admin/actions.js` memakai `supabase.auth.updateUser`. Halaman client `app/admin/password/page.jsx` menampilkan pesan sukses/error.

**Perbaikan:**

Validasi panjang dan kecocokan dilakukan di server, tidak hanya mengandalkan atribut `minLength` di input.

## US-06 Proteksi halaman admin

**Prompt:**

Kerjakan US-06. Semua halaman `/admin` kecuali `/admin/login` hanya boleh dibuka admin yang login, dan setiap aksi yang mengubah data memeriksa login di server.

**Hasil:**

`proxy.js` (pengganti middleware di Next.js 16) dengan matcher `/admin/:path*` memakai `@supabase/ssr` dan `auth.getUser` untuk mengalihkan ke `/admin/login`.

**Perbaikan:**

Menangani `setAll` cookie di proxy dan memastikan aksi mutasi tetap memverifikasi sesi di server, bukan hanya bergantung pada proxy.

## US-07 List Produk

**Prompt:**

Kerjakan US-07. Daftar produk di `/admin` diambil dari database, bukan data contoh.

**Hasil:**

`app/admin/page.jsx` menjadi Server Component `async` memakai `buatKlienAdmin()` (sesi + RLS). Import `lib/data-contoh` dihapus.

**Perbaikan:**

Menambahkan pesan error query dan kondisi kosong dengan petunjuk menekan "Tambah produk".

## US-08 Tambah produk

**Prompt:**

Kerjakan US-08. Form di `/admin/produk/baru` menyimpan produk ke database, setelah menyimpan kembali ke `/admin`, dan aksinya ditolak server bila belum login.

**Hasil:**

`simpanProduk` (Server Action) di `app/admin/actions.js` menyisipkan data ke tabel `produk`. `components/FormProduk.jsx` menjadi komponen client yang memakai `useActionState` dan menerima prop `aksi`.

**Perbaikan:**

Validasi nama wajib dan harga angka positif di server, memanggil `revalidatePath("/admin")` dan `revalidatePath("/")`, lalu `redirect("/admin")`.

## US-09 Ubah produk

**Prompt:**

Kerjakan US-09. Form di `/admin/produk/[id]/ubah` terisi data lama, perubahan tersimpan ke database, dan aksinya ditolak server bila belum login.

**Hasil:**

Halaman mengambil produk dari database dengan `buatKlienAdmin()`. `FormProduk` menambahkan `hidden id`, dan aksi `simpanProduk` yang sama melakukan `update` saat ada `id`.

**Perbaikan:**

Memanggil `notFound()` bila produk tidak ditemukan, dan menghapus komponen `CatatanBelumAktif`.

## US-10 Hapus produk

**Prompt:**

Kerjakan US-10. Tombol "Hapus" meminta konfirmasi, produk terhapus dari database, dan aksinya ditolak server bila belum login.

**Hasil:**

`hapusProduk` (Server Action) menghapus baris dengan `.delete().eq("id", id)`. Komponen client baru `components/TombolHapusProduk.jsx` menampilkan `window.confirm` sebelum submit.

**Perbaikan:**

Memeriksa login di server lewat `pastikanLogin`, lalu `revalidatePath` agar katalog dan halaman admin ikut terbarui.

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.