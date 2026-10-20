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

## US-11 Filter kategori atau pencarian

**Prompt:**

Kerjakan US-11. Pengunjung bisa menyaring produk per kategori atau mencari nama produk di halaman katalog, query dilakukan di sisi server database.

**Hasil:**

`components/FilterKatalog.jsx` menambahkan form pencarian teks dan dropdown kategori dari database. `app/page.jsx` menyaring data dengan `.ilike("nama", ...)` dan `.eq("kategori", ...)`.

**Perbaikan:**

Menampilkan pesan kosong khusus jika hasil pencarian/filter tidak ditemukan ("Tidak ada produk yang cocok dengan pencarian atau kategori itu.").

## US-15 Urutkan produk

**Prompt:**

Kerjakan US-15. Tambahkan pilihan urutan: termurah, termahal, dan terbaru yang diterapkan di query database.

**Hasil:**

Menambahkan fungsi `terapkanUrutan` di `app/page.jsx` yang menerapkan `.order("harga", ...)` atau `.order("created_at", ...)`. Dropdown urutan disertakan dalam `FilterKatalog`.

**Perbaikan:**

Menambahkan tie-breaker `id` pada query sorting untuk mencegah duplikasi atau pergeseran produk saat paginasi.

## US-16 Paginasi atau muat lebih banyak

**Prompt:**

Kerjakan US-16. Batasi daftar produk per halaman di query database dan sediakan navigasi halaman yang mempertahankan parameter filter dan urutan.

**Hasil:**

Menggunakan `.select("*", { count: "exact" })` dan `.range(...)` dengan ukuran 12 produk per halaman. Komponen `components/Paginasi.jsx` merender tombol halaman serta tautan Sebelumnya dan Berikutnya.

**Perbaikan:**

Menghitung total halaman secara dinamis dari `count` database dan mempertahankan query param `q`, `kategori`, dan `urut` menggunakan `URLSearchParams`.

## US-17 Produk terkait di halaman detail

**Prompt:**

Kerjakan US-17. Halaman detail produk menampilkan rekomendasi produk terkait dari kategori yang sama dari database, tidak termasuk produk yang sedang dibuka.

**Hasil:**

`app/produk/[id]/page.jsx` menjalankan query produk dengan kategori yang sama, `.neq("id", id)`, dan batas 4 item.

**Perbaikan:**

Bagian produk terkait disembunyikan secara otomatis bila produk tidak memiliki kategori atau tidak ada produk lain dalam kategori tersebut.

## US-49 Halaman per kategori

**Prompt:**

Kerjakan US-49. Buat halaman khusus per kategori di `/kategori/[slug]` yang menampilkan produk kategori tersebut dari database, dan tautkan nama kategori di halaman detail ke rute tersebut.

**Hasil:**

Membuat helper `lib/kategori.js` untuk konversi slug dan `app/kategori/[slug]/page.jsx` yang memuat produk sesuai slug. Nama kategori di halaman detail menjadi tautan ke halaman kategori tersebut.

**Perbaikan:**

Menangani kategori yang tidak ada dengan fungsi `notFound()` dan memeriksa nilai `null` pada kategori produk.

## US-12 Pilih jumlah sebelum pesan

**Prompt:**

Kerjakan US-12. Pengunjung bisa memilih jumlah produk sebelum memesan via WhatsApp, dan pilihan jumlah beserta total harga ikut tercantum otomatis di pesan WhatsApp.

**Hasil:**

`components/TombolWhatsApp.jsx` diubah menjadi komponen interaktif (`"use client"`) dengan tombol tambah/kurang jumlah pesanan, input jumlah, serta perhitungan total harga otomatis.

**Perbaikan:**

Format pesan WhatsApp diperbarui agar memuat nama produk, jumlah item, harga satuan, dan total harga dalam format Rupiah, serta pembatasan minimal 1 item.

## US-13 PWA

**Prompt:**

Kerjakan US-13. Katalog dapat dipasang di layar HP seperti aplikasi (PWA), menyediakan web app manifest yang menautkan ikon di public/icons, serta service worker.

**Hasil:**

Membuat `app/manifest.js` (Route Metadata Next.js) dengan ikon 192x192 dan 512x512, tema warna, display standalone, `public/sw.js` minimal untuk installability, dan komponen client `components/PendaftarSW.jsx`.

**Perbaikan:**

Menambahkan konfigurasi viewport `themeColor` dan tautan apple icon di `app/layout.jsx`.

## US-22 Halaman Tentang dan kontak toko

**Prompt:**

Kerjakan US-22. Sediakan halaman profil toko dan kontak (`/tentang`) yang memuat profil, alamat, jam operasional, dan tombol chat WhatsApp dari `lib/toko.js`, tertaut di navigasi dan footer.

**Hasil:**

Membuat `app/tentang/page.jsx` dengan tata letak rapi sesuai `DESIGN.md`, dan menambahkan tautan ke Tentang di `components/Header.jsx` dan `components/Footer.jsx`.

**Perbaikan:**

Menyediakan tombol interaktif chat WhatsApp langsung ke nomor toko dengan pesan pembuka ramah.

## US-23 Bagikan atau salin link produk

**Prompt:**

Kerjakan US-23. Sediakan tombol bagikan di halaman detail produk memakai Web Share API atau fallback clipboard dengan umpan balik visual saat tautan disalin.

**Hasil:**

Membuat `components/TombolBagikan.jsx` yang memanfaatkan `navigator.share` dengan fallback `navigator.clipboard.writeText`, serta status umpan balik teks "Link tersalin!" selama beberapa detik.

**Perbaikan:**

Menangani kondisi user membatalkan dialog share (`AbortError`) dan fallback browser lawas.

## US-26 Metadata SEO dan Open Graph

**Prompt:**

Kerjakan US-26. Pasang generateMetadata dinamis pada halaman detail produk agar memuat judul, deskripsi, dan foto produk pada Open Graph dan Twitter card.

**Hasil:**

Fungsi `generateMetadata` di `app/produk/[id]/page.jsx` mengambil nama, deskripsi, dan foto produk dari database, serta penambahan `metadataBase` di `app/layout.jsx`.

**Perbaikan:**

Menangani penanganan error bila produk tidak ditemukan atau database lambat merespons.

## US-27 sitemap.xml dan robots.txt

**Prompt:**

Kerjakan US-27. Buat sitemap.xml otomatis dari database yang memuat beranda, halaman tentang, kategori, dan semua produk, serta robots.txt yang valid.

**Hasil:**

Membuat `app/sitemap.js` yang melakukan query ke tabel `produk` dan `app/robots.js` yang mengizinkan crawling publik serta memproteksi rute `/admin`.

**Perbaikan:**

Membuat prioritas dan frekuensi perubahan yang sesuai untuk halaman beranda, kategori, dan produk.

## US-28 Halaman 404 dan loading kustom

**Prompt:**

Kerjakan US-28. Sediakan halaman 404 kustom dengan tautan kembali ke beranda dan tampilan loading skeleton yang halus saat data sedang dimuat.

**Hasil:**

Memastikan `app/not-found.jsx` memiliki pesan ramah dan tombol kembali ke beranda, serta menambahkan `app/loading.jsx`, `app/produk/[id]/loading.jsx`, dan `app/kategori/[slug]/loading.jsx` dengan efek `animate-pulse`.

**Perbaikan:**

Mendesain struktur skeleton agar menyerupai tata letak kartu produk dan header katalog sebenarnya.