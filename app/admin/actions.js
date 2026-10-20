"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { buatKlienAdmin } from "@/lib/supabase/admin";

async function pastikanLogin() {
  const supabase = await buatKlienAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function simpanProduk(prevState, formData) {
  const { supabase, user } = await pastikanLogin();

  if (!user) {
    return { error: "Anda belum login. Silakan login terlebih dahulu." };
  }

  const id = formData.get("id");
  const nama = (formData.get("nama") || "").toString().trim();
  const hargaRaw = (formData.get("harga") || "").toString().trim();
  const kategori = (formData.get("kategori") || "").toString().trim() || null;
  const fotoUrl = (formData.get("foto_url") || "").toString().trim() || null;
  const deskripsi = (formData.get("deskripsi") || "").toString().trim() || null;

  const errors = {};
  const values = {
    nama,
    harga: hargaRaw,
    kategori,
    foto_url: fotoUrl,
    deskripsi,
  };

  // Validasi di server (US-34)
  if (!nama) {
    errors.nama = "Nama produk wajib diisi.";
  }

  const hargaNum = Number(hargaRaw);
  if (!hargaRaw) {
    errors.harga = "Harga produk wajib diisi.";
  } else if (!Number.isFinite(hargaNum) || hargaNum < 0) {
    errors.harga = "Harga harus berupa angka lebih besar atau sama dengan 0.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      error: "Terdapat data yang belum sesuai. Silakan periksa kolom isian di bawah.",
      errors,
      values,
    };
  }

  const data = {
    nama,
    harga: Math.round(hargaNum),
    kategori,
    foto_url: fotoUrl,
    deskripsi,
  };

  const { error } = id
    ? await supabase.from("produk").update(data).eq("id", id)
    : await supabase.from("produk").insert(data);

  if (error) {
    return {
      error: "Gagal menyimpan produk ke database. Silakan coba lagi.",
      values,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatKlienAdmin();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email atau password salah. Silakan coba lagi." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await buatKlienAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  const passwordBaru = formData.get("password_baru");
  const konfirmasi = formData.get("konfirmasi_password");

  if (!passwordBaru || !konfirmasi) {
    return { error: "Semua kolom wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasi) {
    return { error: "Password baru dan konfirmasi tidak sama." };
  }

  const supabase = await buatKlienAdmin();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Anda belum login. Silakan login terlebih dahulu." };
  }

  const { error } = await supabase.auth.updateUser({ password: passwordBaru });

  if (error) {
    return { error: "Gagal mengganti password. Silakan coba lagi." };
  }

  return { sukses: "Password berhasil diganti." };
}

export async function hapusProduk(formData) {
  const { supabase, user } = await pastikanLogin();

  if (!user) {
    return { error: "Anda belum login. Silakan login terlebih dahulu." };
  }

  const id = formData.get("id");

  if (!id) {
    return { error: "Produk tidak ditemukan." };
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    return { error: "Gagal menghapus produk. Silakan coba lagi." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

function parseBarisCsv(teks) {
  const hasil = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    const next = teks[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      hasil.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  hasil.push(cur.trim());
  return hasil;
}

export async function imporProdukCsv(prevState, formData) {
  const { supabase, user } = await pastikanLogin();

  if (!user) {
    return { error: "Anda belum login. Silakan login terlebih dahulu." };
  }

  const file = formData.get("file_csv");

  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: "Silakan pilih file CSV yang akan diunggah." };
  }

  let kontenTeks = "";
  try {
    kontenTeks = await file.text();
  } catch {
    return { error: "Gagal membaca isi file CSV." };
  }

  if (kontenTeks.charCodeAt(0) === 0xfeff) {
    kontenTeks = kontenTeks.slice(1);
  }

  const semuaBaris = kontenTeks.split(/\r?\n/).filter((b) => b.trim().length > 0);

  if (semuaBaris.length <= 1) {
    return {
      error: "File CSV tidak memiliki baris data (hanya header atau kosong).",
    };
  }

  const header = parseBarisCsv(semuaBaris[0]).map((h) =>
    h.toLowerCase().replace(/[^a-z0-9_]/g, "")
  );

  const idxNama = header.indexOf("nama");
  const idxHarga = header.indexOf("harga");
  const idxKategori = header.indexOf("kategori");
  const idxFotoUrl =
    header.indexOf("foto_url") !== -1
      ? header.indexOf("foto_url")
      : header.indexOf("fotourl");
  const idxDeskripsi = header.indexOf("deskripsi");

  if (idxNama === -1 || idxHarga === -1) {
    return {
      error:
        'Header CSV wajib memuat kolom "nama" dan "harga". Kolom lain yang didukung: "kategori", "foto_url", "deskripsi".',
    };
  }

  const barisValid = [];
  const daftarError = [];

  for (let i = 1; i < semuaBaris.length; i++) {
    const nomorBaris = i + 1;
    const kolom = parseBarisCsv(semuaBaris[i]);

    const nama = (kolom[idxNama] || "").trim();
    const hargaRaw = (kolom[idxHarga] || "").trim();
    const kategori =
      idxKategori !== -1 ? (kolom[idxKategori] || "").trim() || null : null;
    const fotoUrl =
      idxFotoUrl !== -1 ? (kolom[idxFotoUrl] || "").trim() || null : null;
    const deskripsi =
      idxDeskripsi !== -1 ? (kolom[idxDeskripsi] || "").trim() || null : null;

    if (!nama) {
      daftarError.push(`Baris ${nomorBaris}: Nama produk wajib diisi.`);
      continue;
    }

    const hargaNum = Number(hargaRaw);
    if (!hargaRaw || !Number.isFinite(hargaNum) || hargaNum < 0) {
      daftarError.push(
        `Baris ${nomorBaris}: Harga ("${hargaRaw}") harus berupa angka positif.`
      );
      continue;
    }

    barisValid.push({
      nama,
      harga: Math.round(hargaNum),
      kategori,
      foto_url: fotoUrl,
      deskripsi,
    });
  }

  if (barisValid.length > 0) {
    const { error: dbError } = await supabase.from("produk").insert(barisValid);
    if (dbError) {
      return {
        error: `Gagal menyimpan data ke database: ${dbError.message}`,
        totalBerhasil: 0,
        totalGagal: semuaBaris.length - 1,
        daftarError,
      };
    }
  }

  revalidatePath("/admin");
  revalidatePath("/");

  return {
    sukses: true,
    totalBerhasil: barisValid.length,
    totalGagal: daftarError.length,
    daftarError,
  };
}

