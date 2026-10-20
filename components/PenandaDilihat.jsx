"use client";

import { useEffect } from "react";
import { catatRiwayat } from "@/lib/riwayat";

export default function PenandaDilihat({ produk }) {
  useEffect(() => {
    if (produk?.id) {
      catatRiwayat(produk);
    }
  }, [produk]);

  return null;
}