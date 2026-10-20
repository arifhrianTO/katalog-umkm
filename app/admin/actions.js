"use server";

import { redirect } from "next/navigation";
import { buatKlienAdmin } from "@/lib/supabase/admin";

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

