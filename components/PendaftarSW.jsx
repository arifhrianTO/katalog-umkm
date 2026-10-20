"use client";

import { useEffect } from "react";

export default function PendaftarSW() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Lingkungan atau browser mungkin tidak mengizinkan Service Worker (mis. mode privat)
      });
    }
  }, []);

  return null;
}