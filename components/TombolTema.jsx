"use client";

import { useEffect, useState } from "react";

export default function TombolTema() {
  const [gelap, setGelap] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tersimpan = localStorage.getItem("katalog_tema");
    if (tersimpan === "dark") {
      setGelap(true);
      document.documentElement.classList.add("dark");
    } else if (tersimpan === "light") {
      setGelap(false);
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setGelap(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleTema() {
    const baru = !gelap;
    setGelap(baru);
    if (baru) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("katalog_tema", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("katalog_tema", "light");
    }
  }

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Ganti mode gelap/terang"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-teks"
      >
        <span className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTema}
      aria-label={gelap ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      title={gelap ? "Mode terang" : "Mode gelap"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar text-teks transition-colors hover:border-utama hover:text-utama"
    >
      {gelap ? (
        // Ikon Matahari (ke mode terang)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        // Ikon Bulan (ke mode gelap)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}